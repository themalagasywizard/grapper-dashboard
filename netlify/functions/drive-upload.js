const { google } = require('googleapis');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const parentFolderId = process.env.DRIVE_PARENT_FOLDER_ID;
    const clientEmail = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY || '';
    // Netlify often stores newlines as \n
    privateKey = privateKey.replace(/\\n/g, '\n');

    if (!parentFolderId || !clientEmail || !privateKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing Drive env vars' }),
      };
    }

    const jwt = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/drive.file']
    );
    await jwt.authorize();
    const drive = google.drive({ version: 'v3', auth: jwt });

    const ensureUserFolder = async (email) => {
      // Normalize email for consistent folder naming
      const folderName = email.toLowerCase().trim();

      // Find child folder under parent with the normalized name
      const q = [
        `'${parentFolderId}' in parents`,
        "mimeType = 'application/vnd.google-apps.folder'",
        `name = '${folderName.replace(/'/g, "\\'")}'`,
        'trashed = false',
      ].join(' and ');
      
      console.log(`Searching for folder with query: ${q}`);
      const listRes = await drive.files.list({ q, fields: 'files(id, name, webViewLink)' });

      if (listRes.data.files && listRes.data.files.length > 0) {
        console.log(`Found existing folder for ${email}:`, listRes.data.files[0]);
        return listRes.data.files[0];
      }
      
      console.log(`No folder found for ${email}. Creating a new one...`);
      // Create if not found
      const createRes = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentFolderId],
        },
        fields: 'id, name, webViewLink',
      });
      
      console.log(`Created new folder for ${email}:`, createRes.data);
      return createRes.data;
    };

    if (event.httpMethod === 'GET') {
      const email = (event.queryStringParameters?.email || '').trim();
      if (!email) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing email' }) };
      }
      const folder = await ensureUserFolder(email);
      // Enable webViewLink
      await drive.permissions.create({ fileId: folder.id, requestBody: { role: 'reader', type: 'anyone' } }).catch(() => {});
      const getRes = await drive.files.get({ fileId: folder.id, fields: 'id, name, webViewLink' });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, folder: getRes.data }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { email, filename, mimeType, dataBase64 } = body;
      if (!email || !filename || !dataBase64) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing email, filename or data' }) };
      }
      const folder = await ensureUserFolder(email);
      const media = {
        mimeType: mimeType || 'application/octet-stream',
        body: Buffer.from(dataBase64, 'base64'),
      };
      
      console.log(`Attempting to upload file '${filename}' to folder ID '${folder.id}'...`);
      
      try {
        const createRes = await drive.files.create({
          requestBody: { name: filename, parents: [folder.id] },
          media,
          fields: 'id, name, webViewLink',
        });
        
        console.log(`Successfully uploaded file:`, createRes.data);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, file: createRes.data, folderId: folder.id }) };
      } catch (uploadError) {
        console.error('Google Drive API file upload error:', uploadError);
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ 
            error: 'File upload to Google Drive failed.', 
            details: uploadError.message 
          }) 
        };
      }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};





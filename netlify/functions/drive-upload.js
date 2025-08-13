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
      // Find child folder under parent with name == email
      const q = [
        `'${parentFolderId}' in parents`,
        "mimeType = 'application/vnd.google-apps.folder'",
        `name = '${email.replace(/'/g, "\\'")}'`,
        'trashed = false',
      ].join(' and ');
      const listRes = await drive.files.list({ q, fields: 'files(id, name, webViewLink, webContentLink)' });
      if (listRes.data.files && listRes.data.files.length > 0) {
        return listRes.data.files[0];
      }
      // Create if not found
      const createRes = await drive.files.create({
        requestBody: {
          name: email,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentFolderId],
        },
        fields: 'id, name, webViewLink, webContentLink',
      });
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
      const createRes = await drive.files.create({
        requestBody: { name: filename, parents: [folder.id] },
        media,
        fields: 'id, name, webViewLink',
      });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, file: createRes.data, folderId: folder.id }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};




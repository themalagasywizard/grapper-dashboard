exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get environment variables
        const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
        const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
        // Default ranges can be overridden via env
        const CAMPAIGNS_RANGE = process.env.GOOGLE_SHEETS_CAMPAIGNS_RANGE || process.env.GOOGLE_SHEETS_RANGE || 'Global1!A1:AC2000';
        const LOGIN_RANGE = process.env.GOOGLE_SHEETS_LOGIN_RANGE || 'Mail!A1:ZZ2000';
        const TOOLBOX_RANGE = process.env.GOOGLE_SHEETS_TOOLBOX_RANGE || "'Boite à Outil'!A1:ZZ2000";
        const EVENTS_RANGE = process.env.GOOGLE_SHEETS_EVENTS_RANGE || 'Events!A1:Z2000';

        // Validate environment variables
        if (!API_KEY || !SPREADSHEET_ID) {
            console.error('Missing environment variables:', { 
                hasApiKey: !!API_KEY, 
                hasSpreadsheetId: !!SPREADSHEET_ID 
            });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error: Missing required environment variables' 
                })
            };
        }

        // Use batchGet to fetch campaigns and login emails in one request
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${encodeURIComponent(CAMPAIGNS_RANGE)}&ranges=${encodeURIComponent(LOGIN_RANGE)}&ranges=${encodeURIComponent(TOOLBOX_RANGE)}&ranges=${encodeURIComponent(EVENTS_RANGE)}&key=${API_KEY}`;

        console.log('Fetching from Google Sheets (batchGet)...', { SPREADSHEET_ID, CAMPAIGNS_RANGE, LOGIN_RANGE });

        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Sheets API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: `Google Sheets API error: ${response.status} ${response.statusText}`,
                    details: errorText
                })
            };
        }

        const data = await response.json();

        if (!data.valueRanges || !Array.isArray(data.valueRanges)) {
            console.error('Invalid batchGet response structure:', data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid response from Google Sheets API (batchGet)',
                    data
                })
            };
        }

        const campaignsValues = data.valueRanges[0]?.values || [];
        const mailValues = data.valueRanges[1]?.values || [];
        const toolboxValues = data.valueRanges[2]?.values || [];
        const eventsValues = data.valueRanges[3]?.values || [];

        // Process login data with header-detected columns
        console.log('Mail worksheet raw data (first 5 rows):', mailValues.slice(0, 5));

        const normalize = (s) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        let loginData = [];
        if (mailValues.length > 0) {
            const header = mailValues[0].map(h => normalize(h));
            const rows = mailValues.slice(1);

            // Find email column: prefer headers containing 'mail' or 'email'
            const emailIdx = header.findIndex(h => h.includes('mail') || h.includes('email'));
            // Find password column: support 'mot de passe', 'motde passe', 'password', 'mdp'
            const passwordIdx = header.findIndex(h => h.includes('mot de passe') || h.includes('motde passe') || h.includes('password') || h === 'mdp' || h.includes('motdepasse'));

            console.log('Detected columns:', { emailIdx, passwordIdx, headerRaw: mailValues[0] });

            loginData = rows
                .map((row, index) => {
                    const email = (row[emailIdx] || '').toString().trim();
                    const password = (row[passwordIdx] || '').toString().trim();

                    if (index < 5) {
                        console.log(`Row ${index + 2}:`, { email, passwordMasked: password ? '[HAS_PASSWORD]' : '[NO_PASSWORD]', rawRow: row });
                    }

                    if (!email || !email.includes('@')) return null;
                    return { email, password };
                })
                .filter(Boolean);
        }

        // Keep backward compatibility for loginEmails
        const loginEmails = loginData.map(item => item.email);

        console.log('Successfully fetched data:', {
            campaignsRows: campaignsValues.length,
            loginEmailsCount: loginEmails.length,
            loginDataCount: loginData.length,
            toolboxRows: toolboxValues.length,
            eventsRows: eventsValues.length
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: campaignsValues,
                loginEmails,
                loginData, // Include full login data with passwords
                toolbox: toolboxValues,
                events: eventsValues,
                rowCount: campaignsValues.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Serverless function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};
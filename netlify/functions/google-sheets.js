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

        let loginData = [];
        if (mailValues.length > 1) { // Make sure we have header and at least one data row
            // First row is headers, we know email is column A (0) and password is column B (1)
            const headers = mailValues[0];
            const rows = mailValues.slice(1); // Skip header row

            // Fixed indices for Mail worksheet: Column A (0) for email, Column B (1) for password
            const emailIdx = 0;
            const passwordIdx = 1;

            console.log('Processing Mail worksheet:', {
                headers,
                totalRows: rows.length,
                emailColumn: headers[emailIdx],
                passwordColumn: headers[passwordIdx]
            });

            loginData = rows
                .map((row, index) => {
                    if (!Array.isArray(row)) return null;
                    
                    const email = (row[emailIdx] || '').toString().trim();
                    const password = (row[passwordIdx] || '').toString().trim();

                    // Debug log for first few rows
                    if (index < 5) {
                        console.log(`Row ${index + 1}:`, { 
                            email, 
                            hasPassword: !!password,
                            rowData: row 
                        });
                    }

                    if (!email || !email.includes('@')) return null;
                    return { email, password };
                })
                .filter(Boolean);

            console.log('Processed login data:', {
                totalUsers: loginData.length,
                sampleEmails: loginData.slice(0, 3).map(d => d.email)
            });
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
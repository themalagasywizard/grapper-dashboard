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
        const LOGIN_RANGE = process.env.GOOGLE_SHEETS_LOGIN_RANGE || 'Mail!A1:B2000'; // Forcing A:B to ensure both columns are read
        const TOOLBOX_RANGE = process.env.GOOGLE_SHEETS_TOOLBOX_RANGE || "'Boite à Outil'!A1:ZZ2000";
        const EVENTS_RANGE = process.env.GOOGLE_SHEETS_EVENTS_RANGE || 'Events!A1:Z2000';
        const USER_BILLING_RANGE = process.env.GOOGLE_SHEETS_USER_BILLING_RANGE || "'Adresse Facturation Talents'!A1:G2000";
        const AGENCY_BILLING_RANGE = process.env.GOOGLE_SHEETS_AGENCY_BILLING_RANGE || "'Adresse Facturation Grapper'!A1:A10";

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

        // Use batchGet to fetch all data in one request
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${encodeURIComponent(CAMPAIGNS_RANGE)}&ranges=${encodeURIComponent(LOGIN_RANGE)}&ranges=${encodeURIComponent(TOOLBOX_RANGE)}&ranges=${encodeURIComponent(EVENTS_RANGE)}&ranges=${encodeURIComponent(USER_BILLING_RANGE)}&ranges=${encodeURIComponent(AGENCY_BILLING_RANGE)}&key=${API_KEY}`;



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
        const userBillingValues = data.valueRanges[4]?.values || [];
        const agencyBillingValues = data.valueRanges[5]?.values || [];

        // Process login data with header-detected columns


        const normalize = (s) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        let loginData = [];
        if (mailValues.length > 0) {
            const header = mailValues[0].map(h => normalize(h));
            const rows = mailValues.slice(1);

            // Find email column: prefer headers containing 'mail' or 'email'
            const emailIdx = header.findIndex(h => h.includes('mail') || h.includes('email'));
            // Find password column: support 'mot de passe', 'motde passe', 'password', 'mdp'
            const passwordIdx = header.findIndex(h => h.includes('mot de passe') || h.includes('motde passe') || h.includes('password') || h === 'mdp' || h.includes('motdepasse'));



            if (emailIdx === -1) {
                console.error("Could not find a valid email column in 'Mail' sheet.");
            } else {
                loginData = rows
                    .map((row, index) => {
                        const email = (row[emailIdx] || '').toString().trim();
                        // Only get password if the index was found
                        const password = passwordIdx > -1 ? (row[passwordIdx] || '').toString().trim() : '';

                        if (index < 5) {

                        }

                        if (!email || !email.includes('@')) return null;
                        return { email, password };
                    })
                    .filter(Boolean);
            }
        }

        // Keep backward compatibility for loginEmails
        const loginEmails = loginData.map(item => item.email);

        // Process user billing data (Adresse Facturation Talents)
        let userBillingData = [];
        if (userBillingValues.length > 0) {
            const rows = userBillingValues.slice(1); // Skip header row
            userBillingData = rows.map(row => ({
                email: (row[0] || '').toString().trim(),
                prenom: (row[1] || '').toString().trim(), // Prénom (first name)
                nom: (row[2] || '').toString().trim(), // Nom (last name)
                companyName: (row[3] || '').toString().trim(),
                address: (row[4] || '').toString().trim(),
                postalCode: (row[5] || '').toString().trim(),
                city: (row[6] || '').toString().trim(),
                country: (row[7] || '').toString().trim()
            })).filter(user => user.email && user.email.includes('@'));
        }

        // Process agency billing data (Adresse Facturation Grapper)
        let agencyBillingData = [];
        if (agencyBillingValues.length > 0) {
            agencyBillingData = agencyBillingValues.map(row => (row[0] || '').toString().trim()).filter(line => line.trim() !== '');
        }

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
                userBillingData,
                agencyBillingData,
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
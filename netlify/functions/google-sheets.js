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
        const LOGIN_RANGE = process.env.GOOGLE_SHEETS_LOGIN_RANGE || 'Mail!A1:C2000'; // A:Mail, C:Mot de Passe
        // Also request column C separately to ensure it's included even if API trims trailing columns
        const LOGIN_PASSWORD_RANGE = process.env.GOOGLE_SHEETS_LOGIN_PASSWORD_RANGE || 'Mail!C1:C2000'; // Column C only
        const TOOLBOX_RANGE = process.env.GOOGLE_SHEETS_TOOLBOX_RANGE || "'Boite à Outil'!A1:ZZ2000";
        const EVENTS_RANGE = process.env.GOOGLE_SHEETS_EVENTS_RANGE || 'Events!A1:Z2000';
        const USER_BILLING_RANGE = process.env.GOOGLE_SHEETS_USER_BILLING_RANGE || "'Adresse Facturation Talents'!A1:L2000";
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
        // Include LOGIN_PASSWORD_RANGE separately to ensure column C is read
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${encodeURIComponent(CAMPAIGNS_RANGE)}&ranges=${encodeURIComponent(LOGIN_RANGE)}&ranges=${encodeURIComponent(LOGIN_PASSWORD_RANGE)}&ranges=${encodeURIComponent(TOOLBOX_RANGE)}&ranges=${encodeURIComponent(EVENTS_RANGE)}&ranges=${encodeURIComponent(USER_BILLING_RANGE)}&ranges=${encodeURIComponent(AGENCY_BILLING_RANGE)}&key=${API_KEY}`;



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
        const mailPasswordValues = data.valueRanges[2]?.values || []; // Column C only
        const toolboxValues = data.valueRanges[3]?.values || [];
        const eventsValues = data.valueRanges[4]?.values || [];
        const userBillingValues = data.valueRanges[5]?.values || [];
        const agencyBillingValues = data.valueRanges[6]?.values || [];

        // Debug: Log the actual Mail sheet response structure
        console.log('Mail sheet response - number of rows:', mailValues.length);
        console.log('Mail password column (C) response - number of rows:', mailPasswordValues.length);
        if (mailValues.length > 0) {
            console.log('Mail sheet first row (header) length:', mailValues[0].length);
            console.log('Mail sheet first row (header) raw:', JSON.stringify(mailValues[0]));
            if (mailValues.length > 1) {
                console.log('Mail sheet second row length:', mailValues[1].length);
                console.log('Mail sheet second row raw:', JSON.stringify(mailValues[1]));
            }
        }
        if (mailPasswordValues.length > 0) {
            console.log('Mail password column (C) first row:', JSON.stringify(mailPasswordValues[0]));
            if (mailPasswordValues.length > 1) {
                console.log('Mail password column (C) second row:', JSON.stringify(mailPasswordValues[1]));
            }
        }

        // Process login data with header-detected columns
        const normalize = (s) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

        let loginData = [];
        if (mailValues.length > 0) {
            const header = mailValues[0].map(h => normalize(h));
            const rows = mailValues.slice(1);
            
            // Extract passwords from the separate column C request
            const passwordRows = mailPasswordValues.slice(1); // Skip header row

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
                        
                        // Get password from the separate column C request (mailPasswordValues)
                        // This ensures we get column C even if the main request trimmed it
                        let password = '';
                        if (passwordRows.length > index && passwordRows[index] && passwordRows[index].length > 0) {
                            // passwordRows[index] is an array with one element (the password from column C)
                            password = (passwordRows[index][0] || '').toString().trim();
                        } else {
                            // Fallback: try to get from row[2] if available
                            password = row.length > 2 ? (row[passwordIdx] || '').toString().trim() : '';
                        }

                        // Debug first few rows
                        if (index < 5) {
                            console.log(`Row ${index + 2}: email='${email}', password='${password}', passwordFromColumnC=${passwordRows.length > index && passwordRows[index] ? passwordRows[index][0] : 'N/A'}, hasPassword=${!!password}`);
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
                email: (row[0] || '').toString().trim(), // Column A - User email
                prenom: (row[1] || '').toString().trim(), // Column B - Prénom (first name)
                nom: (row[2] || '').toString().trim(), // Column C - Nom (last name)
                address: (row[3] || '').toString().trim(), // Column D - Adresse (billing address)
                postalCode: (row[4] || '').toString().trim(), // Column E - CP (postal code)
                city: (row[5] || '').toString().trim(), // Column F - Ville (city)
                country: (row[6] || '').toString().trim(), // Column G - Pays (country)
                banque: (row[7] || '').toString().trim(), // Column H - Banque (bank name)
                iban: (row[8] || '').toString().trim(), // Column I - IBAN
                swiftBic: (row[9] || '').toString().trim(), // Column J - SWIFT/BIC
                siret: (row[10] || '').toString().trim(), // Column K - SIRET
                tva: (row[11] || '').toString().trim() // Column L - TVA
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
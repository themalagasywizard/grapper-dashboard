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
        const RANGE = process.env.GOOGLE_SHEETS_RANGE || 'Global1!A1:AC2000';

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

        // Construct Google Sheets API URL
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
        
        console.log('Fetching from Google Sheets...', { SPREADSHEET_ID, RANGE });

        // Fetch data from Google Sheets API
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
        
        // Validate response structure
        if (!data.values || !Array.isArray(data.values)) {
            console.error('Invalid response structure:', data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid response from Google Sheets API',
                    data: data
                })
            };
        }

        console.log('Successfully fetched data:', {
            rows: data.values.length,
            headers: data.values[0]?.length || 0
        });

        // Return the data
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: data.values,
                rowCount: data.values.length,
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
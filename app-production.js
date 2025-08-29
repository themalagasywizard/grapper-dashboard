const { useState, useEffect, useRef } = React;

const formatUsername = (email) => {
    if (!email) return '';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
};

// Translation object with English and French
const translations = {
    en: {
        // Header & Navigation
        welcome: "Welcome",
        logout: "Logout",
        dashboard: "Dashboard",
        history: "Collaboration History", 
        profile: "Profile",
        availableUsers: "Available Users",
        
        // Dashboard
        myTotalCampaigns: "My Total Campaigns",
        upcomingCampaigns: "Upcoming Campaigns",
        myTotalRevenue: "My Total Revenue",
        myCampaignCalendar: "My Campaign Calendar",
        myRecentCampaigns: "My Recent Campaigns",
        noCampaignsFound: "No campaigns found for your account.",
        checkAvailableUsers: "Check the \"Available Users\" tab to see valid email addresses.",
        deadline: "Deadline",
        
        // History
        myCampaigns: "My Campaigns",
        completed: "Completed",
        myRevenue: "My Revenue",
        avgRevenue: "Avg Revenue",
        allMyCampaigns: "All My Campaigns",
        upcoming: "Upcoming",
        dateFin: "End Date",
        marque: "Brand",
        remunerationTotale: "Total remuneration",
        talent: "Talent",
        status: "Status",
        exportMyData: "Export My Data",
        myCampaignHistory: "My Campaign History",
        contactAdmin: "Please contact your agency administrator if you believe this is an error.",
        showing: "Showing",
        to: "to",
        of: "of",
        results: "results",
        previous: "Previous",
        next: "Next",
        
        // Profile
        memberSince: "Member since",
        activeInfluencer: "Active Influencer",
        verified: "Verified",
        totalEarned: "Total Earned",
        avgPerCampaign: "Avg per Campaign",
        myTopBrands: "My Top Brands by Revenue",
        
        // Available Users
        availableUserAccounts: "Available User Accounts",
        availableUsersDesc: "These are the influencer accounts available in the system. Use any of these email addresses to login (password can be anything for demo).",
        copy: "Copy",
        copied: "Copied!",
        loginInstructions: "Login Instructions:",
        copyAnyEmail: "1. Copy any email address above",
        logoutAndPaste: "2. Logout and paste the email in the login form",
        enterAnyPassword: "3. Enter any password (demo mode)",
        viewDashboard: "4. View that influencer's personalized dashboard",
        
        // Login
        welcomeToGrapper: "Welcome to Grapper",
        signInAccess: "Sign in to access your influencer dashboard",
        emailAddress: "Email Address",
        enterEmail: "Enter your email",
        password: "Password",
        enterPassword: "Enter your password",
        signIn: "Sign In",
        emailNotFound: "Email not found. Please check the \"Available Users\" list for valid emails.",
        enterBothFields: "Please enter both email and password",
        invalidPassword: "Invalid password. Please enter the correct password.",
        
        // Sorting & Filtering
        dateNewestFirst: "Date Fin (Newest First)",
        dateOldestFirst: "Date Fin (Oldest First)",
        marqueAZ: "Marque (A-Z)",
        marqueZA: "Marque (Z-A)",
        revenueHighLow: "Revenue (High to Low)",
        revenueLowHigh: "Revenue (Low to High)",
        
        // Loading
        loadingCampaignData: "Loading campaign data...",
        parsingGoogleSheet: "Fetching live data from Google Sheets",
        
        // Errors
        apiError: "Error connecting to Google Sheets. Please try again.",
        configurationError: "Google Sheets configuration required. Please contact administrator.",
        
        // Misc
        noDescription: "No description",
        lastUpdated: "Last updated",
        
        // Language
        language: "Language",
        english: "English",
        french: "Français",
        invoiceGenerator: "Invoice Generator",
        invoiceNumber: "Invoice Number",
        date: "Date",
        amount: "Amount (€)",
        description: "Description",
        agentName: "Agent Name",
        agentAddress: "Agent Address",
        generateInvoice: "Generate & Preview Invoice",
        invoiceDescription: "Campaign Collaboration Services",
        toolbox: "Toolbox",
        toolboxIntro: "Daily resources available to you:",
        noTools: "No tools available for your account yet.",
    },
    fr: {
        // Header & Navigation
        welcome: "Bienvenue",
        logout: "Déconnexion",
        dashboard: "Tableau de bord",
        history: "Historique des collaborations",
        profile: "Profil",
        availableUsers: "Utilisateurs disponibles",
        
        // Dashboard
        myTotalCampaigns: "Mes campagnes totales",
        upcomingCampaigns: "Campagnes à venir",
        myTotalRevenue: "Mon chiffre d'affaires total",
        myCampaignCalendar: "Mon calendrier de campagnes",
        myRecentCampaigns: "Mes campagnes récentes",
        noCampaignsFound: "Aucune campagne trouvée pour votre compte.",
        checkAvailableUsers: "Consultez l'onglet \"Utilisateurs disponibles\" pour voir les adresses e-mail valides.",
        deadline: "Échéance",
        
        // History
        myCampaigns: "Mes campagnes",
        completed: "Terminé",
        myRevenue: "Mon chiffre d'affaires",
        avgRevenue: "CA moyen",
        allMyCampaigns: "Toutes mes campagnes",
        upcoming: "À venir",
        dateFin: "Date Fin",
        marque: "Marque",
        remunerationTotale: "Rémunération totale",
        talent: "Talent",
        status: "Statut",
        exportMyData: "Exporter mes données",
        myCampaignHistory: "Historique de mes campagnes",
        contactAdmin: "Veuillez contacter votre administrateur d'agence si vous pensez qu'il s'agit d'une erreur.",
        showing: "Affichage de",
        to: "à",
        of: "sur",
        results: "résultats",
        previous: "Précédent",
        next: "Suivant",
        
        // Profile
        memberSince: "Membre depuis",
        activeInfluencer: "Influenceur actif",
        verified: "Vérifié",
        totalEarned: "Total gagné",
        avgPerCampaign: "Moyenne par campagne",
        myTopBrands: "Mes meilleures marques par chiffre d'affaires",
        
        // Available Users
        availableUserAccounts: "Comptes utilisateurs disponibles",
        availableUsersDesc: "Voici les comptes d'influenceurs disponibles dans le système. Utilisez n'importe laquelle de ces adresses e-mail pour vous connecter (le mot de passe peut être n'importe quoi pour la démo).",
        copy: "Copier",
        copied: "Copié !",
        loginInstructions: "Instructions de connexion :",
        copyAnyEmail: "1. Copiez n'importe quelle adresse e-mail ci-dessus",
        logoutAndPaste: "2. Déconnectez-vous et collez l'e-mail dans le formulaire de connexion",
        enterAnyPassword: "3. Entrez n'importe quel mot de passe (mode démo)",
        viewDashboard: "4. Consultez le tableau de bord personnalisé de cet influenceur",
        
        // Login
        welcomeToGrapper: "Bienvenue sur Grapper",
        signInAccess: "Connectez-vous pour accéder à votre tableau de bord d'influenceur",
        emailAddress: "Adresse e-mail",
        enterEmail: "Entrez votre e-mail",
        password: "Mot de passe",
        enterPassword: "Entrez votre mot de passe",
        signIn: "Se connecter",
        emailNotFound: "E-mail non trouvé. Veuillez vérifier la liste \"Utilisateurs disponibles\" pour les e-mails valides.",
        enterBothFields: "Veuillez saisir l'e-mail et le mot de passe",
        invalidPassword: "Mot de passe incorrect. Veuillez saisir le bon mot de passe.",
        
        // Sorting & Filtering
        dateNewestFirst: "Date Fin (Plus récent d'abord)",
        dateOldestFirst: "Date Fin (Plus ancien d'abord)",
        marqueAZ: "Marque (A-Z)",
        marqueZA: "Marque (Z-A)",
        revenueHighLow: "Chiffre d'affaires (Élevé vers bas)",
        revenueLowHigh: "Chiffre d'affaires (Bas vers élevé)",
        
        // Loading
        loadingCampaignData: "Chargement des données de campagne...",
        parsingGoogleSheet: "Récupération des données en direct depuis Google Sheets",
        
        // Errors
        apiError: "Erreur de connexion à Google Sheets. Veuillez réessayer.",
        configurationError: "Configuration Google Sheets requise. Veuillez contacter l'administrateur.",
        
        // Misc
        noDescription: "Aucune description",
        lastUpdated: "Dernière mise à jour",
        
        // Language
        language: "Langue",
        english: "English",
        french: "Français",
        invoiceGenerator: "Générateur de facture",
        invoiceNumber: "Numéro de facture",
        date: "Date",
        amount: "Montant (€)",
        description: "Description",
        agentName: "Nom de l'agent",
        agentAddress: "Adresse de l'agent",
        generateInvoice: "Générer et prévisualiser la facture",
        invoiceDescription: "Services de collaboration de campagne",
        toolbox: "Boîte à outils",
        toolboxIntro: "Ressources quotidiennes disponibles :",
        noTools: "Aucun outil disponible pour votre compte pour le moment.",
    }
};

// Google Sheets API Configuration
// IMPORTANT: Replace these with your actual values
// Secure configuration - API keys now stored as environment variables
const GOOGLE_SHEETS_CONFIG = {
    // API calls now go through secure Netlify serverless function
    NETLIFY_FUNCTION_URL: '/.netlify/functions/google-sheets',
    // Fallback for development - will be removed in production
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
};

// Translation hook
const useTranslation = (language) => {
    const t = (key) => {
        return translations[language][key] || translations.en[key] || key;
    };
    return { t };
};

// Google Sheets API integration
class GoogleSheetsService {
    constructor() {
        this.isInitialized = false;
        this.lastFetch = null;
        this.cacheTimeout = 30000; // 30 seconds cache
        this.loginEmails = [];
    }

    async initialize() {
        if (this.isInitialized) return true;

        try {
            if (!window.gapi) {
                throw new Error('Google API not loaded');
            }

            return new Promise((resolve, reject) => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: GOOGLE_SHEETS_CONFIG.API_KEY,
                            discoveryDocs: [GOOGLE_SHEETS_CONFIG.DISCOVERY_DOC],
                        });
                        
                        // Wait a bit for the discovery document to load
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        if (!window.gapi.client.sheets) {
                            throw new Error('Google Sheets API not available after initialization');
                        }
                        
                        this.isInitialized = true;
                        resolve(true);
                    } catch (error) {
                        console.error('Error during GAPI client init:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Failed to initialize Google Sheets API:', error);
            return false;
        }
    }

    async fetchSheetData() {
        try {
            // Check cache
            if (this.lastFetch && Date.now() - this.lastFetch.timestamp < this.cacheTimeout) {
                return this.lastFetch.data;
            }

            // Use secure Netlify serverless function
            const response = await fetch(GOOGLE_SHEETS_CONFIG.NETLIFY_FUNCTION_URL);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Serverless function error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`Serverless function error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                console.error('Function returned error:', result);
                throw new Error(result.error || 'Unknown serverless function error');
            }

            const rows = result.data;
            if (!rows || rows.length === 0) {
                throw new Error('No data found in spreadsheet');
            }

            // Convert campaigns to object format
            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });



            // Capture login emails from serverless function (Mail sheet)
            this.loginEmails = Array.isArray(result.loginEmails) ? result.loginEmails : [];
            
            // Capture full login data with passwords
            this.loginData = Array.isArray(result.loginData) ? result.loginData : [];


            // Capture toolbox raw matrix
            this.toolboxMatrix = Array.isArray(result.toolbox) ? result.toolbox : [];
            // Capture raw Events sheet
            this.eventsMatrix = Array.isArray(result.events) ? result.events : [];

            // Cache the result
            this.lastFetch = {
                data: data,
                timestamp: Date.now()
            };

            return data;
        } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
            throw error;
        }
    }

    // Legacy method - now replaced by secure serverless function
    async fetchWithRestAPI() {
        throw new Error('Direct REST API calls are disabled for security. Use serverless function instead.');
    }

    // Method to force refresh data
    async refreshData() {
        this.lastFetch = null;
        return await this.fetchSheetData();
    }

    getLoginEmails() {
        return this.loginEmails || [];
    }
    
    getLoginData() {
        return this.loginData || [];
    }

    getToolboxMatrix() {
        return this.toolboxMatrix || [];
    }

    getEventsMatrix() {
        return this.eventsMatrix || [];
    }
}

// Create global instance
const googleSheetsService = new GoogleSheetsService();

// Helper function to normalize strings for comparison (removes accents, lowercase, trims)
const normalizeString = (s) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Function to convert French date format (DD/MM/YYYY) to YYYY-MM-DD
const convertFrenchDate = (frenchDate) => {
    if (!frenchDate || frenchDate.trim() === '') return null;
    
    const parts = frenchDate.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return null;
};

// Function to clean currency amounts
const cleanCurrency = (amount) => {
    if (!amount || amount.trim() === '') return 0;
    
    // Remove all non-numeric characters except comma and dot
    const cleaned = amount.replace(/[^0-9,.]/g, '');
    
    // Handle French number format (comma as decimal separator)
    const withDot = cleaned.replace(',', '.');
    
    const number = parseFloat(withDot);
    return isNaN(number) ? 0 : number;
};

// Extract unique users from Google Sheets data
const extractUsersFromSheetData = (sheetData) => {
    const usersMap = new Map();
    



    
    sheetData.forEach((row, index) => {
        // Prefer Talent (A) if it contains an email, otherwise fall back to Mail
        const talentValue = row['Talent'] || '';
        const mailValue = row['Mail'] || '';
        const email = (talentValue.includes('@') ? talentValue : mailValue).trim();
        const talent = talentValue; // may be email in new DB
        
        if (index < 5) {

        }
        
        // Only process rows with valid email addresses (not empty, not #N/A)
        if (email && email !== '' && email !== '#N/A' && email.includes('@')) {
            if (!usersMap.has(email)) {
                const nameFallback = email.split('@')[0].replace(/[._-]+/g, ' ');
                usersMap.set(email, {
                    email,
                    name: talent && !talent.includes('@') ? talent.trim() : nameFallback,
                    joinDate: convertFrenchDate(row['Date Création']) || '2024-01-01'
                });
            }
        }
    });
    
    const users = Array.from(usersMap.values());

    return users;
};

// Build available users from the dedicated Mail sheet (if provided by serverless)
const buildUsersFromLoginEmails = (emails, sheetData) => {
    const users = [];
    const seen = new Set();
    const nameByEmail = new Map();
    // Try to map email -> Talent name from main sheet rows
    sheetData.forEach(row => {
        const email = (row['Mail'] || '').trim().toLowerCase();
        const name = (row['Talent'] || '').trim();
        if (email && name && email.includes('@') && !nameByEmail.has(email)) {
            nameByEmail.set(email, name);
        }
    });
    emails.forEach(raw => {
        const email = (raw || '').trim();
        if (!email || !email.includes('@')) return;
        const key = email.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const nameGuess = nameByEmail.get(key) || email.split('@')[0].replace(/[._-]+/g, ' ');
        users.push({ email, name: nameGuess || 'User', joinDate: '2024-01-01' });
    });
    return users;
};

// Build available users from login data with passwords
const buildUsersFromLoginData = (loginData, sheetData) => {
    const users = [];
    const seen = new Set();
    const nameByEmail = new Map();
    // Try to map email -> Talent name from main sheet rows
    sheetData.forEach(row => {
        const email = (row['Mail'] || '').trim().toLowerCase();
        const name = (row['Talent'] || '').trim();
        if (email && name && email.includes('@') && !nameByEmail.has(email)) {
            nameByEmail.set(email, name);
        }
    });
    loginData.forEach((item, index) => {
        const email = (item.email || '').trim();
        const password = (item.password || '').trim();
        
        // Debug log for each item
        if (index < 5) {
        }
        
        if (!email || !email.includes('@')) return;
        const key = email.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const nameGuess = nameByEmail.get(key) || formatUsername(email);
        
        const user = { 
            email, 
            name: nameGuess || 'User', 
            joinDate: '2024-01-01',
            password: password // Include password for validation
        };
        

        
        users.push(user);
    });
    return users;
};

// Data transformation function for Google Sheets data (campaigns)
const transformSheetDataToCampaigns = (sheetData) => {
    return sheetData
        .filter(row => {
            // Include any row that has a brand and some user identifier (Talent or Mail)
            const marque = row['Marque'];
            const talentValue = row['Talent'] || '';
            const mailValue = row['Mail'] || '';
            const emailCandidate = (talentValue.includes('@') ? talentValue : mailValue).trim();
            return marque && emailCandidate;
        })
        .map((row, index) => {
            // Prefer user email from Talent if it's an email, else from Mail, else derive
            const talent = row['Talent'] || '';
            const mail = row['Mail'] || '';
            let userEmail = '';
            if (talent.includes('@')) {
                userEmail = talent.trim();
            } else if (mail && mail.includes('@')) {
                userEmail = mail.trim();
            } else if (talent) {
                userEmail = `${talent.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            }

            // Compute net revenue: Rémunération totale (L) - Commission (R)
            const remunerationTotale = cleanCurrency(row['Rémunération totale']);
            const commission = cleanCurrency(row['Commission']);
            const netRevenue = Math.max(0, remunerationTotale - commission);

            // Determine a display date for history: prefer Date Fin, else Preview, else Post
            const dateFin = convertFrenchDate(row['Date Fin']);
            const preview = convertFrenchDate(row['Preview'] || row['Date Début'] || row['Date Debut'] || row['Date début']);
            const post = convertFrenchDate(row['Post']);
            const displayDate = dateFin || preview || post || '';

            // Map status to Completed/Upcoming for stats
            const rawStatus = (row['Status'] || '').toLowerCase();
            const isCompleted = rawStatus.includes('fait') || rawStatus.includes('complete') || rawStatus.includes('termin') || rawStatus.includes('fini');

            return {
                Campaign_ID: `sheet_${index}`,
                Talent: talent || '',
                Influencer_Email: userEmail,
                Date: displayDate,
                Brand_Name: row['Marque'] || '',
                Revenue: netRevenue,
                Status: isCompleted ? 'Completed' : 'Upcoming',
                DateCreation: convertFrenchDate(row['Date Création']),
                Description: row['Description rapide de la demande'] || '',
                Format: row['Format (influence vs UGC)'] || '',
                Commission: commission,
                OriginalData: row // Keep original for reference
            };
        });
};

// Build calendar events for Preview (Column E) and Post (Column G) with color/status from Column H
const buildActionEventsFromSheet = (sheetData, rawEventsMatrix) => {
    const events = [];
    sheetData.forEach((row, index) => {
        // Email is in Talent (A) per new DB; fallback to Mail if needed
        const emailRaw = (row['Talent'] || row['Mail'] || '').trim();
        const email = emailRaw;
        const brand = row['Marque'] || '';
        const status = (row['Status'] || '').trim();
        const talent = row['Talent'] || '';
        const preview = (row['Preview'] || '') || '';
        const post = (row['Post'] || '') || '';

        const colorForStatus = (s) => {
            const lower = s.toLowerCase();
            if (lower.includes('fait') || lower.includes('termin') || lower.includes('done') || lower.includes('complete')) return '#22c55e';
            if (lower.includes('modif') || lower.includes('draft') || lower.includes('brouillon')) return '#f59e0b';
            if (lower.includes('annul') || lower.includes('cancel')) return '#ef4444';
            return '#6366f1';
        };

        const makeEvent = (isoDate, actionType) => {
            const bgColor = actionType === 'Preview' ? '#f59e0b' : actionType === 'Post' ? '#3b82f6' : colorForStatus(status);
            return {
                id: `evt_${index}_${actionType}`,
                title: `${brand}`,
                date: isoDate,
                backgroundColor: bgColor,
                borderColor: 'transparent',
                textColor: '#ffffff',
                            extendedProps: {
                brand,
                status,
                actionType,
                email,
                talent,
                originalStatus: status // Keep original status from Column H
            }
            };
        };

        const dPreview = convertFrenchDate(preview);
        if (dPreview) {
            events.push(makeEvent(dPreview, 'Preview'));
        }
        const dPost = convertFrenchDate(post);
        if (dPost) {
            events.push(makeEvent(dPost, 'Post'));
        }
    });

    // Parse Events worksheet: A=email, B=date, C=address, D=start time, E=end time, F=brand, G=info
    if (Array.isArray(rawEventsMatrix) && rawEventsMatrix.length > 1) {
        const header = rawEventsMatrix[0];
        const rows = rawEventsMatrix.slice(1);
        const idx = (name) => header.findIndex(h => (h || '').toLowerCase() === name.toLowerCase());
        const cEmail = idx('email') !== -1 ? idx('email') : 0; // fallback A
        const cDate = idx('date') !== -1 ? idx('date') : 1; // fallback B
        const cAddress = 2; // Column C for address
        const cStart = idx('start') !== -1 ? idx('start') : 3; // fallback D
        const cEnd = idx('end') !== -1 ? idx('end') : 4; // fallback E
        const cBrand = idx('brand') !== -1 ? idx('brand') : 5; // fallback F
        const cInfo = 6; // Column G for additional information

        rows.forEach((r, rIdx) => {
            const email = (r[cEmail] || '').trim();
            const dateStr = (r[cDate] || '').trim();
            const address = (r[cAddress] || '').trim();
            const startTime = (r[cStart] || '').trim();
            const endTime = (r[cEnd] || '').trim();
            const brand = (r[cBrand] || '').trim();
            const eventInfo = (r[cInfo] || '').trim();
            
            if (!email || !dateStr || !brand) return;
            
            // Build time display
            let timeDisplay = '';
            if (startTime && endTime) {
                timeDisplay = `${startTime} - ${endTime}`;
            } else if (startTime) {
                timeDisplay = startTime;
            } else if (endTime) {
                timeDisplay = `Until ${endTime}`;
            }
            
            // Build ISO date (YYYY-MM-DD from possible DD/MM/YYYY)
            const isoDate = convertFrenchDate(dateStr) || dateStr;
            const iso = startTime ? `${isoDate}T${startTime}` : isoDate;
            
            events.push({
                id: `ev_${rIdx}`,
                title: `${brand}`,
                date: iso,
                backgroundColor: '#8b5cf6', // purple for Events
                borderColor: 'transparent',
                textColor: '#ffffff',
                extendedProps: {
                    brand,
                    status: 'Event',
                    actionType: 'Event',
                    email,
                    talent: '',
                    originalStatus: 'Event',
                    timeDisplay: timeDisplay,
                    eventInfo: eventInfo,
                    startTime: startTime,
                    endTime: endTime,
                    address: address
                }
            });
        });
    }
    return events;
};

// Main data state
let allCampaigns = [];
let availableUsers = [];
let currentUser = null;
let lastDataUpdate = null;
let allActionEvents = [];
let toolboxMatrix = [];
let lastKnownEventCount = 0; // Track event count for notifications

// Event Modal Function
const showEventModal = (eventType, brand, status, language, eventData = {}) => {
    const { t } = useTranslation(language);
    
    // Remove any existing modal
    const existingModal = document.getElementById('event-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Build content based on event type
    let middleContent = '';
    
    if (eventType === 'Event') {
        // For Events from Events sheet: show Time, Address, and Information instead of Status
        const timeDisplay = eventData.timeDisplay || 'N/A';
        const eventInfo = eventData.eventInfo || '';
        const address = eventData.address || '';
        
        middleContent = `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">Time:</span>
                <span class="font-semibold text-gray-900">${timeDisplay}</span>
            </div>
            
            ${address ? `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">Address:</span>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">
                    ${address}
                </a>
            </div>
            ` : ''}
            
            ${eventInfo ? `
            <div class="p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">Information:</span>
                <div class="mt-2 text-gray-900">${eventInfo}</div>
            </div>
            ` : ''}
        `;
    } else {
        // For Preview/Post events: show Status
        middleContent = `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">Status:</span>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}">${status}</span>
            </div>
        `;
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="event-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeEventModal(event)">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onclick="event.stopPropagation()">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-900">Event Details</h3>
                    <button onclick="closeEventModal()" class="text-gray-400 hover:text-gray-600">
                        <span class="text-xl">&times;</span>
                    </button>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium text-gray-700">Type:</span>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(eventType)}">${eventType}</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium text-gray-700">Brand:</span>
                        <span class="font-semibold text-gray-900">${brand}</span>
                    </div>
                    
                    ${middleContent}
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button onclick="closeEventModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add escape key listener
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeEventModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

// Helper function to get type-specific colors
const getTypeColor = (type) => {
    switch(type) {
        case 'Preview': return 'bg-orange-100 text-orange-800';
        case 'Post': return 'bg-blue-100 text-blue-800';
        case 'Event': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// Helper function to get status-specific colors
const getStatusColor = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes('fait') || lower.includes('complete') || lower.includes('termin')) {
        return 'bg-green-100 text-green-800';
    } else if (lower.includes('progress') || lower.includes('cours') || lower.includes('ongoing')) {
        return 'bg-yellow-100 text-yellow-800';
    } else if (lower.includes('cancel') || lower.includes('annul')) {
        return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
};

// Function to close modal
const closeEventModal = (event) => {
    if (event && event.target !== event.currentTarget) return; // Only close if clicking outside
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.remove();
    }
};

// Notifications Component
const NotificationsBell = ({ userEvents, language }) => {
    const { t } = useTranslation(language);
    const [notifications, setNotifications] = React.useState([]);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [hasNewNotifications, setHasNewNotifications] = React.useState(false);

    React.useEffect(() => {
        // Check for new events compared to last known count
        if (userEvents.length > lastKnownEventCount && lastKnownEventCount > 0) {
            const newEvents = userEvents.slice(lastKnownEventCount);
            const newNotifications = newEvents.map((event, index) => ({
                id: `notif_${Date.now()}_${index}`,
                message: `New ${event.extendedProps?.actionType || 'event'}: ${event.title}`,
                time: new Date().toLocaleTimeString(),
                type: event.extendedProps?.actionType || 'event'
            }));
            
            setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep max 10
            setHasNewNotifications(true);
        }
        lastKnownEventCount = userEvents.length;
    }, [userEvents]);

    const clearNotifications = () => {
        setHasNewNotifications(false);
        setShowNotifications(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                title="Notifications"
            >
                <span className="text-lg">🔔</span>
                {hasNewNotifications && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </button>
            
            {showNotifications && (
                <div className="fixed inset-0 top-16 sm:absolute sm:inset-auto sm:top-12 sm:right-0 w-full sm:w-80 p-4 sm:p-0 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <button 
                                onClick={clearNotifications}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Clear all
                            </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">{notif.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                notif.type === 'Preview' ? 'bg-orange-100 text-orange-800' :
                                                notif.type === 'Post' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {notif.type}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Header Navigation Component
const Navigation = ({ user, onLogout, currentTab, setCurrentTab, userCampaigns, userEvents, language, toggleLanguage, lastUpdated }) => {
    const { t } = useTranslation(language);
    const totalRevenue = userCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <img 
                            src="./logo.png.png" 
                            alt="Grapper Logo" 
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Grapper</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Notifications Bell */}
                        <NotificationsBell userEvents={userEvents} language={language} />
                        
                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
                        >
                            <span className="text-2xl">{language === 'en' ? '🇫🇷' : '🇬🇧'}</span>
                        </button>
                        
                        <div className="text-right hidden sm:block">
                            <span className="text-gray-700 block">{t('welcome')}, {formatUsername(user.name)}</span>
                            {lastUpdated && (
                                <span className="text-xs text-gray-500">
                                    {t('lastUpdated')}: {new Date(lastUpdated).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                        
                        <button 
                            onClick={onLogout}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
                
                {/* Mobile: centered dropdown menu */}
                <div className="sm:hidden mt-2 mb-1 flex justify-center">
                    <select
                        aria-label="Navigate"
                        value={currentTab}
                        onChange={(e) => setCurrentTab(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="dashboard">📅 {t('dashboard')}</option>
                        <option value="history">📋 {t('history')}</option>
                        <option value="profile">👤 {t('profile')}</option>
                        <option value="invoices">💳 {t('invoiceGenerator') || 'Invoices'}</option>
                        <option value="toolbox">🧰 {t('toolbox')}</option>
                    </select>
                </div>

                {/* Desktop/tablet: original sliding tabs */}
                <div className="hidden sm:flex space-x-6 -mb-px overflow-x-auto whitespace-nowrap pb-1">
                    <button
                        onClick={() => setCurrentTab('dashboard')}
                        className={`py-3 px-3 border-b-2 font-medium text-sm sm:text-base ${
                            currentTab === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📅 {t('dashboard')}
                    </button>
                    <button
                        onClick={() => setCurrentTab('history')}
                        className={`py-3 px-3 border-b-2 font-medium text-sm sm:text-base ${
                            currentTab === 'history'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📋 {t('history')}
                    </button>
                    <button
                        onClick={() => setCurrentTab('profile')}
                        className={`py-3 px-3 border-b-2 font-medium text-sm sm:text-base ${
                            currentTab === 'profile'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        👤 {t('profile')}
                    </button>
                    <button
                        onClick={() => setCurrentTab('invoices')}
                        className={`py-3 px-3 border-b-2 font-medium text-sm sm:text-base ${
                            currentTab === 'invoices'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        💳 {t('invoiceGenerator') || 'Invoices'}
                    </button>
                    <button
                        onClick={() => setCurrentTab('toolbox')}
                        className={`py-3 px-3 border-b-2 font-medium text-sm sm:text-base ${
                            currentTab === 'toolbox'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        🧰 {t('toolbox')}
                    </button>
                </div>
            </div>
        </header>
    );
};

// Dashboard Component with Calendar (filtered for user)
const Dashboard = ({ campaigns, events = [], language }) => {
    const { t } = useTranslation(language);
    const calendarRef = useRef(null);
    const calendarInstance = useRef(null);
    
    const upcomingCampaigns = campaigns.filter(c => c.Status === 'Upcoming');
    const thisMonthRevenue = upcomingCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    useEffect(() => {
        if (calendarRef.current && !calendarInstance.current && window.FullCalendar) {
            const renderTimeout = setTimeout(() => {
                // Prepare all events for calendar
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of today
                
                // All events for calendar view (including past events)
                const allEvents = campaigns.map(campaign => {
                    const isCompleted = campaign.Status === 'Completed';
                    const backgroundColor = isCompleted ? '#22c55e' : '#6366f1'; // Green for completed, purple for upcoming
                    

                    
                    return {
                        id: campaign.Campaign_ID,
                        title: `${campaign.Brand_Name}`,
                        date: campaign.Date, // This is the Date Fin
                        extendedProps: {
                            revenue: campaign.Revenue,
                            talent: campaign.Talent,
                            status: campaign.Status
                        },
                        backgroundColor: backgroundColor,
                        borderColor: 'transparent',
                        textColor: '#ffffff'
                    };
                });

                const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
                calendarInstance.current = new FullCalendar.Calendar(calendarRef.current, {
                    // Show Calendar by default even on mobile, but allow switching to list
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,upcomingList'
                    },
                    views: {
                        upcomingList: {
                            type: 'list',
                            duration: { years: 2 },
                            buttonText: 'Upcoming'
                        }
                    },
                    buttonText: {
                        dayGridMonth: 'Calendar',
                        upcomingList: 'List'
                    },
                    dayMaxEventRows: isSmallScreen ? 2 : 3,
                    expandRows: true,
                    height: 'auto',
                    windowResize: function() {
                        // Adjust button sizes for mobile each resize
                        try {
                            const isMobile = window.matchMedia('(max-width: 640px)').matches;
                            const toolbar = calendarRef.current?.querySelector?.('.fc-toolbar');
                            if (toolbar) {
                                toolbar.style.fontSize = isMobile ? '12px' : '';
                            }
                            const buttons = calendarRef.current?.querySelectorAll?.('.fc-button');
                            if (buttons && buttons.forEach) {
                                buttons.forEach(btn => {
                                    btn.style.padding = isMobile ? '4px 6px' : '';
                                    btn.style.fontSize = isMobile ? '12px' : '';
                                    btn.style.lineHeight = isMobile ? '1.1' : '';
                                });
                            }
                            const titleEl = calendarRef.current?.querySelector?.('.fc-toolbar-title');
                            if (titleEl) {
                                titleEl.style.fontSize = isMobile ? '16px' : '';
                            }
                        } catch (_) {}
                    },
                    events: function(fetchInfo, successCallback, failureCallback) {
                        // Safely get current view type with fallback
                        let currentView = 'upcomingList'; // Default to upcomingList
                        
                        try {
                            if (fetchInfo && fetchInfo.view && fetchInfo.view.type) {
                                currentView = fetchInfo.view.type;
                            } else if (calendarInstance.current && calendarInstance.current.view) {
                                currentView = calendarInstance.current.view.type;
                            }
                        } catch (error) {

                        }
                        
                        if (currentView === 'upcomingList') {
                            // For list view: only upcoming events from today onwards, sorted chronologically
                            const upcomingEvents = (Array.isArray(events) ? events : [])
                                .filter(event => new Date(event.date) >= today)
                                .sort((a, b) => new Date(a.date) - new Date(b.date));

                            successCallback(upcomingEvents);
                        } else {
                            // For calendar view (dayGridMonth): ALL events (past and future)
                            const allProvided = Array.isArray(events) ? events : [];

                            successCallback(allProvided);
                        }
                    },
                    eventClick: function(info) {
                        // Get event details from extendedProps
                        const eventType = info.event.extendedProps?.actionType || 'Campaign';
                        const brand = info.event.extendedProps?.brand || info.event.title;
                        let status = info.event.extendedProps?.originalStatus || info.event.extendedProps?.status || 'N/A';
                        
                        // Transform \"Facture a envoyer\" to \"Fait\"
                        if (status.toLowerCase().includes('facture') && status.toLowerCase().includes('envoyer')) {
                            status = 'Fait';
                        }
                        
                        // Prepare additional event data for Events from Events sheet
                        const eventData = {
                            timeDisplay: info.event.extendedProps?.timeDisplay,
                            eventInfo: info.event.extendedProps?.eventInfo,
                            startTime: info.event.extendedProps?.startTime,
                            endTime: info.event.extendedProps?.endTime,
                            address: info.event.extendedProps?.address
                        };
                        
                        // Create and show popup modal
                        showEventModal(eventType, brand, status, language, eventData);
                    },
                    height: 'auto',
                    eventDisplay: 'block',
                    listDayFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
                    listDaySideFormat: false,
                    noEventsContent: t('noCampaignsFound') || 'No upcoming campaigns',
                    viewDidMount: function(view) {
                        // Refresh events when view changes
                        if (calendarInstance.current) {
                            calendarInstance.current.refetchEvents();
                        }
                    },
                    eventDidMount: function(info) {
                        // Apply smaller mobile sizing on first mount
                        try {
                            const isMobile = window.matchMedia('(max-width: 640px)').matches;
                            const toolbar = calendarRef.current?.querySelector?.('.fc-toolbar');
                            if (toolbar) {
                                toolbar.style.fontSize = isMobile ? '12px' : '';
                            }
                            const buttons = calendarRef.current?.querySelectorAll?.('.fc-button');
                            if (buttons && buttons.forEach) {
                                buttons.forEach(btn => {
                                    btn.style.padding = isMobile ? '4px 6px' : '';
                                    btn.style.fontSize = isMobile ? '12px' : '';
                                    btn.style.lineHeight = isMobile ? '1.1' : '';
                                });
                            }
                            const titleEl = calendarRef.current?.querySelector?.('.fc-toolbar-title');
                            if (titleEl) {
                                titleEl.style.fontSize = isMobile ? '16px' : '';
                            }
                        } catch (_) {}
                        // Enforce colors so nothing overrides them, based on action type
                        try {
                            const type = (info.event.extendedProps && info.event.extendedProps.actionType) || '';
                            const originalBg = info.event.backgroundColor;
                            let enforcedBg = null;
                            if (type === 'Preview') enforcedBg = '#f59e0b'; // orange
                            else if (type === 'Post') enforcedBg = '#3b82f6'; // blue
                            else if (type === 'Event') enforcedBg = '#8b5cf6'; // purple
                            else if (originalBg) enforcedBg = originalBg;
                            
                            
                            if (enforcedBg) {
                                // Completely override all background properties
                                info.el.style.setProperty('background', enforcedBg, 'important');
                                info.el.style.setProperty('background-color', enforcedBg, 'important');
                                info.el.style.setProperty('background-image', 'none', 'important');
                                info.el.style.setProperty('background-clip', 'padding-box', 'important');
                                info.el.style.setProperty('border', 'none', 'important');
                                info.el.style.setProperty('border-color', 'transparent', 'important');
                                info.el.style.setProperty('color', '#ffffff', 'important');
                                
                                // Target all possible child elements
                                const childSelectors = [
                                    '.fc-event-main', 
                                    '.fc-list-event-title', 
                                    '.fc-event-title',
                                    '.fc-event-main-frame',
                                    '.fc-daygrid-event-dot',
                                    '.fc-event-time',
                                    '.fc-event-title-container'
                                ];
                                
                                childSelectors.forEach(selector => {
                                    const child = info.el.querySelector(selector);
                                    if (child) {
                                        child.style.setProperty('background', enforcedBg, 'important');
                                        child.style.setProperty('background-color', enforcedBg, 'important');
                                        child.style.setProperty('background-image', 'none', 'important');
                                        child.style.setProperty('color', '#ffffff', 'important');
                                    }
                                });
                                
                                // Also apply to all direct children
                                Array.from(info.el.children).forEach(child => {
                                    child.style.setProperty('background', enforcedBg, 'important');
                                    child.style.setProperty('background-color', enforcedBg, 'important');
                                    child.style.setProperty('background-image', 'none', 'important');
                                    child.style.setProperty('color', '#ffffff', 'important');
                                });
                            }
                        } catch (_) {}

                        // Add revenue information to list view events
                        if (info.view.type === 'upcomingList' || info.view.type.includes('list')) {
                            const campaign = campaigns.find(c => c.Campaign_ID === info.event.id);
                            if (campaign) {
                                const titleElement = info.el.querySelector('.fc-list-event-title') || info.el.querySelector('.fc-event-title');
                                if (titleElement) {
                                    titleElement.innerHTML = 
                                        `<strong>${campaign.Brand_Name}</strong><br/>
                                        <small style=\"color: #6b7280;\">€${campaign.Revenue.toLocaleString()} • ${campaign.Status}</small>`;
                                }
                            }
                        }
                    }
                });
                
                calendarInstance.current.render();
            }, 100);

            return () => clearTimeout(renderTimeout);
        }
        
        return () => {
            if (calendarInstance.current) {
                calendarInstance.current.destroy();
                calendarInstance.current = null;
            }
        };
    }, [campaigns, language]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">🚀</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('upcomingCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{upcomingCampaigns.length}</p>
                        </div>
                        <div className="gradient-bg-success p-3 rounded-lg">
                            <span className="text-white text-xl">⏰</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalRevenue')}</p>
                            <p className="text-3xl font-bold text-gray-900">€{campaigns.reduce((sum, c) => sum + c.Revenue, 0).toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('myCampaignCalendar')}</h2>
                <div ref={calendarRef} className="calendar-container"></div>
            </div>

            {/* Quick View - Recent Campaigns */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('myRecentCampaigns')}</h2>
                {campaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('noCampaignsFound')}</p>
                        <p className="text-sm">{t('checkAvailableUsers')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {[...campaigns]
                            .sort((a, b) => new Date(b.Date) - new Date(a.Date))
                            .slice(0, 5)
                            .map((campaign) => (
                            <div key={campaign.Campaign_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="gradient-bg p-2 rounded-lg">
                                        <span className="text-white font-bold">{campaign.Brand_Name[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{campaign.Brand_Name}</h3>
                                        <p className="text-sm text-gray-500">{t('deadline')}: {campaign.Date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">€{campaign.Revenue.toLocaleString()}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        campaign.Status === 'Completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {campaign.Status === 'Completed' ? t('completed') : t('upcoming')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// History Component (filtered for user)
const History = ({ campaigns, language }) => {
    const { t } = useTranslation(language);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const completedCampaigns = campaigns.filter(c => c.Status === 'Completed');
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.Revenue, 0);

    const filteredCampaigns = campaigns.filter(campaign => {
        if (filter === 'completed') return campaign.Status === 'Completed';
        if (filter === 'upcoming') return campaign.Status === 'Upcoming';
        return true;
    });

    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
            comparison = new Date(a.Date) - new Date(b.Date);
        } else if (sortBy === 'brand') {
            comparison = a.Brand_Name.localeCompare(b.Brand_Name);
        } else if (sortBy === 'revenue') {
            comparison = a.Revenue - b.Revenue;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
    });

    const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCampaigns = sortedCampaigns.slice(startIndex, startIndex + itemsPerPage);

    const exportToCSV = () => {
        const headers = [t('marque'), t('dateFin'), t('remunerationTotale'), t('status')];
        const csvData = [
            headers.join(','),
            ...sortedCampaigns.map(campaign => 
                [campaign.Brand_Name, campaign.Date, campaign.Revenue, campaign.Status === 'Completed' ? t('completed') : t('upcoming')].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_grapper_campaigns.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">🚀</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('upcomingCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.filter(c => c.Status === 'Upcoming').length}</p>
                        </div>
                        <div className="gradient-bg-success p-3 rounded-lg">
                            <span className="text-white text-xl">⏰</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalRevenue')}</p>
                            <p className="text-3xl font-bold text-gray-900">€{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">{t('allMyCampaigns')}</option>
                            <option value="completed">{t('completed')}</option>
                            <option value="upcoming">{t('upcoming')}</option>
                        </select>
                        
                        <select 
                            value={`${sortBy}-${sortOrder}`} 
                            onChange={(e) => {
                                const [sort, order] = e.target.value.split('-');
                                setSortBy(sort);
                                setSortOrder(order);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="date-desc">{t('dateNewestFirst')}</option>
                            <option value="date-asc">{t('dateOldestFirst')}</option>
                            <option value="brand-asc">{t('marqueAZ')}</option>
                            <option value="brand-desc">{t('marqueZA')}</option>
                            <option value="revenue-desc">{t('revenueHighLow')}</option>
                            <option value="revenue-asc">{t('revenueLowHigh')}</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={exportToCSV}
                        className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {t('exportMyData')}
                    </button>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{t('myCampaignHistory')}</h2>
                </div>
                
                {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">{t('noCampaignsFound')}</p>
                        <p className="text-sm mt-2">{t('contactAdmin')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto hidden sm:block">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('marque')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dateFin')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('remunerationTotale')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedCampaigns.map((campaign) => (
                                    <tr key={campaign.Campaign_ID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="gradient-bg p-2 rounded-lg mr-3">
                                                    <span className="text-white text-xs font-bold">{campaign.Brand_Name[0]}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{campaign.Brand_Name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.Date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            €{campaign.Revenue.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                campaign.Status === 'Completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {campaign.Status === 'Completed' ? t('completed') : t('upcoming')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Mobile card list */}
                {campaigns.length > 0 && (
                    <div className="sm:hidden divide-y divide-gray-200">
                        {paginatedCampaigns.map((campaign) => (
                            <div key={campaign.Campaign_ID} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="gradient-bg p-2 rounded-lg">
                                            <span className="text-white text-xs font-bold">{campaign.Brand_Name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{campaign.Brand_Name}</p>
                                            <p className="text-xs text-gray-500">{t('dateFin')}: {campaign.Date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">€{campaign.Revenue.toLocaleString()}</p>
                                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${campaign.Status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{campaign.Status === 'Completed' ? t('completed') : t('upcoming')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            {t('showing')} {startIndex + 1} {t('to')} {Math.min(startIndex + itemsPerPage, sortedCampaigns.length)} {t('of')} {sortedCampaigns.length} {t('results')}
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('previous')}
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('next')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Profile Component
const Profile = ({ user, campaigns, language }) => {
    const { t } = useTranslation(language);
    const completedCampaigns = campaigns.filter(c => c.Status === 'Completed');
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.Revenue, 0);
    const avgRevenue = campaigns.length > 0 ? totalRevenue / campaigns.length : 0;

    const topBrands = campaigns.reduce((acc, campaign) => {
        acc[campaign.Brand_Name] = (acc[campaign.Brand_Name] || 0) + campaign.Revenue;
        return acc;
    }, {});

    const sortedBrands = Object.entries(topBrands)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start space-x-6">
                    <div className="gradient-bg p-6 rounded-full">
                        <span className="text-white text-3xl font-bold">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{formatUsername(user.name)}</h1>
                        <p className="text-gray-600 mb-2">{user.email}</p>
                        <p className="text-sm text-gray-500">{t('memberSince')} {new Date(user.joinDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {t('activeInfluencer')}
                            </span>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {t('verified')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">🚀</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('upcomingCampaigns')}</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.filter(c => c.Status === 'Upcoming').length}</p>
                        </div>
                        <div className="gradient-bg-success p-3 rounded-lg">
                            <span className="text-white text-xl">⏰</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('myTotalRevenue')}</p>
                            <p className="text-3xl font-bold text-gray-900">€{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Brands */}
            {sortedBrands.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t('myTopBrands')}</h2>
                    <div className="space-y-3">
                        {sortedBrands.map(([brand, revenue], index) => (
                            <div key={brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="gradient-bg p-2 rounded-lg">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{brand}</span>
                                </div>
                                <span className="font-semibold text-gray-900">€{revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Invoice Generator Component
const InvoiceGenerator = ({ user, campaigns, language }) => {
    const { t } = useTranslation(language);

    // TVA Regimes with their rates and legal mentions
    const tvaRegimes = [
        {
            id: 'franchise',
            name: 'Franchise en base (art. 293 B CGI)',
            rate: 0,
            legalMention: 'TVA non applicable, art. 293 B du CGI'
        },
        {
            id: 'france20',
            name: 'Assujetti TVA France 20%',
            rate: 20,
            legalMention: 'TVA au taux normal 20%'
        },
        {
            id: 'intraUe',
            name: 'B2B intra-UE (autoliquidation)',
            rate: 0,
            legalMention: 'Autoliquidation/Reverse charge – art. 196 Directive 2006/112/CE'
        },
        {
            id: 'export',
            name: 'Export hors UE (0% TVA)',
            rate: 0,
            legalMention: 'Prestations de services hors champ de la TVA de l\'UE'
        },
        {
            id: 'b2cUe',
            name: 'B2C UE (TVA FR 20%)',
            rate: 20,
            legalMention: 'TVA française 20% appliquée (B2C UE)'
        }
    ];

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: 'F' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        selectedRegime: 'france20',
        confirmationChecked: false,
        items: [{
            description: 'Campaign Collaboration Services',
            quantity: 1,
            unitPrice: campaigns.reduce((sum, c) => sum + c.Revenue, 0) || 0
        }]
    });

    const [userBillingData, setUserBillingData] = useState(null);
    const [agencyBillingData, setAgencyBillingData] = useState([]);

    // Load billing data on component mount
    React.useEffect(() => {
        const loadBillingData = async () => {
            try {
                const response = await fetch('/.netlify/functions/google-sheets');
                const data = await response.json();
                if (data.success) {
                    // Find user billing data by email
                    const userBilling = data.userBillingData?.find(u =>
                        u.email.toLowerCase() === user.email.toLowerCase()
                    );
                    setUserBillingData(userBilling || null);
                    setAgencyBillingData(data.agencyBillingData || []);
                }
            } catch (error) {
                console.error('Error loading billing data:', error);
            }
        };
        loadBillingData();
    }, [user.email]);

    const handleInvoiceChange = (e) => {
        setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
    };

    const handleRegimeChange = (e) => {
        setInvoiceData({ ...invoiceData, selectedRegime: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        setInvoiceData({ ...invoiceData, items: newItems });
    };

    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, {
                description: '',
                quantity: 1,
                unitPrice: 0
            }]
        });
    };

    const removeItem = (index) => {
        if (invoiceData.items.length > 1) {
            const newItems = invoiceData.items.filter((_, i) => i !== index);
            setInvoiceData({ ...invoiceData, items: newItems });
        }
    };

    // Calculate totals
    const selectedRegime = tvaRegimes.find(r => r.id === invoiceData.selectedRegime);
    const subtotal = invoiceData.items.reduce((sum, item) =>
        sum + (parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 1))
    , 0);
    const tvaAmount = (subtotal * (selectedRegime?.rate || 0)) / 100;
    const totalTTC = subtotal + tvaAmount;

    const generateInvoice = () => {
        if (!invoiceData.confirmationChecked) {
            alert('Please confirm that the tax information is accurate before generating the invoice.');
            return;
        }

        const invoiceWindow = window.open('', '_blank');
        const userName = userBillingData?.prenom && userBillingData?.nom
            ? `${userBillingData.prenom} ${userBillingData.nom}`
            : userBillingData?.companyName || user.name;
        const userAddress = userBillingData?.address || '';
        const userLocation = userBillingData ? `${userBillingData.postalCode} ${userBillingData.city} ${userBillingData.country}` : '';

        invoiceWindow.document.write(`
            <html>
            <head>
                <title>${invoiceData.invoiceNumber} - ${userName}</title>
                <style>
                    @media screen {
                        body {
                            font-family: 'Arial', sans-serif;
                            margin: 0;
                            padding: 20px;
                            max-width: 210mm;
                            margin: 0 auto;
                            background: white;
                        }
                        @media (max-width: 768px) {
                            body {
                                padding: 10px;
                                font-size: 14px;
                            }
                            .invoice-container {
                                padding: 15mm;
                            }
                            .header-section {
                                flex-direction: column;
                                align-items: flex-start;
                            }
                            .agency-details {
                                margin-left: 0;
                                margin-top: 20px;
                            }
                            .invoice-table {
                                font-size: 11px;
                            }
                            .invoice-table th, .invoice-table td {
                                padding: 6px 4px;
                            }
                        }
                        .no-print { display: block; }
                        .button-container {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            display: flex;
                            gap: 10px;
                            z-index: 1000;
                        }
                        .action-button {
                            padding: 12px 24px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: opacity 0.2s;
                            font-size: 14px;
                            min-width: 120px;
                        }
                        @media (max-width: 768px) {
                            .action-button {
                                padding: 16px 28px;
                                font-size: 16px;
                                min-width: 140px;
                                margin: 0 8px;
                            }
                            .button-container {
                                flex-direction: column;
                                gap: 12px;
                                align-items: center;
                            }
                            .save-pdf {
                                width: 100%;
                                max-width: 250px;
                                height: 50px;
                                font-size: 18px;
                            }
                        }
                        .action-button:hover { opacity: 0.9; }
                        .save-pdf { background-color: #2563eb; color: white; }
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            height: 297mm;
                            width: 210mm;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .no-print { display: none; }
                        .page-break { page-break-before: always; }
                        .invoice-container {
                            padding: 15mm !important;
                            max-width: 210mm !important;
                        }
                        .header-section {
                            margin-bottom: 20px !important;
                        }
                        .invoice-table {
                            font-size: 10px !important;
                            margin: 15px 0 !important;
                        }
                        .invoice-table th, .invoice-table td {
                            padding: 4px 6px !important;
                        }
                        .legal-mention, .disclaimers {
                            font-size: 8px !important;
                            line-height: 1.2 !important;
                            margin: 10px 0 !important;
                        }
                        .banking-details {
                            font-size: 9px !important;
                        }
                    }
                    .invoice-container {
                        max-width: 210mm;
                        margin: 0 auto;
                        padding: 20mm;
                        box-sizing: border-box;
                    }
                    .header-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        align-items: flex-start;
                    }
                    .user-details {
                        flex: 1;
                        text-align: left;
                        margin-top: -10px;
                    }
                    .agency-details {
                        flex: 1;
                        text-align: left;
                        margin-left: 40px;
                        margin-top: 15px;
                    }
                    .invoice-meta {
                        text-align: left;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                        width: fit-content;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        font-size: 12px;
                    }
                    .invoice-table th, .invoice-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    .invoice-table th { background-color: #f8f9fa; font-weight: bold; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .totals-section {
                        margin-left: auto;
                        width: 200px;
                        margin-top: 20px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .total-row.final { border-bottom: 2px solid #333; font-weight: bold; }
                    .legal-mention {
                        margin: 20px 0;
                        padding: 15px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                        font-size: 11px;
                    }
                    .disclaimers {
                        margin-top: 30px;
                        font-size: 10px;
                        line-height: 1.4;
                        color: #666;
                    }

                    .regime-selector {
                        margin: 20px 0;
                        padding: 15px;
                        background: #e9ecef;
                        border-radius: 5px;
                    }
                </style>
                                <script>
                    function savePDF() {
                        // Hide buttons before printing/saving
                        document.querySelector('.button-container').style.display = 'none';

                        // Force single page layout for mobile
                        document.body.style.height = '297mm';
                        document.body.style.overflow = 'hidden';

                        // Trigger print dialog (mobile browsers will offer PDF save)
                        window.print();

                        // Restore original layout
                        document.querySelector('.button-container').style.display = 'flex';
                        document.body.style.height = '';
                        document.body.style.overflow = '';
                    }
                </script>
            </head>
            <body>
                <div class="no-print button-container">
                    <button onclick="savePDF()" class="action-button save-pdf">💾 Save as PDF</button>
                </div>

                <div class="invoice-container">
                    <!-- Invoice Title -->
                    <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #333;">
                            ${invoiceData.invoiceNumber} - ${userName}
                        </h1>
                    </div>

                    <!-- Header Section -->
                    <div class="header-section">
                        <div class="user-details">
                            <strong>${userName}</strong><br/>
                            ${userBillingData?.address || ''}<br/>
                            ${userBillingData ? `${userBillingData.postalCode} ${userBillingData.city} ${userBillingData.country}` : ''}<br/>
                            ${userBillingData?.siret ? `SIRET: ${userBillingData.siret}<br/>` : ''}
                            ${userBillingData?.tva ? `TVA: ${userBillingData.tva}<br/>` : ''}
                        </div>
                        <div class="agency-details">
                            ${agencyBillingData.slice(0, 5).map(line => `<div>${line}</div>`).join('')}
                        </div>
                    </div>

                    <!-- Invoice Metadata -->
                    <div class="invoice-meta">
                        <strong>Date de facturation:</strong> ${invoiceData.date}<br/>
                        <strong>Numéro de la facture:</strong> ${invoiceData.invoiceNumber}<br/>
                        <strong>Conditions de paiement:</strong> 30 jours
                    </div>

                    <!-- Invoice Table -->
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="text-center">Quantité</th>
                                <th class="text-right">Prix unitaire HT</th>
                                <th class="text-center">% TVA</th>
                                <th class="text-right">Total TVA</th>
                                <th class="text-right">Total TTC</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoiceData.items.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td class="text-center">${item.quantity}</td>
                                    <td class="text-right">${parseFloat(item.unitPrice || 0).toFixed(2)} €</td>
                                    <td class="text-center">${selectedRegime?.rate || 0}%</td>
                                    <td class="text-right">${((parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 1)) * (selectedRegime?.rate || 0) / 100).toFixed(2)} €</td>
                                    <td class="text-right">${((parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 1)) * (1 + (selectedRegime?.rate || 0) / 100)).toFixed(2)} €</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Totals Section -->
                    <div class="totals-section">
                        <div class="total-row">
                            <span>Total HT:</span>
                            <span>${subtotal.toFixed(2)} €</span>
                        </div>
                        <div class="total-row">
                            <span>Total TVA:</span>
                            <span>${tvaAmount.toFixed(2)} €</span>
                        </div>
                        <div class="total-row final">
                            <span>Total TTC:</span>
                            <span>${totalTTC.toFixed(2)} €</span>
                        </div>
                    </div>

                    <!-- Legal Mention -->
                    <div class="legal-mention">
                        <strong>Mention légale:</strong> ${selectedRegime?.legalMention || 'TVA non applicable'}
                    </div>

                    <!-- Disclaimers -->
                    <div class="disclaimers">
                        <div style="margin-bottom: 15px;">
                            <strong>FR:</strong> Responsabilité des informations fiscales — Les informations d'identification (statut, NIF/CIF/SIREN, numéros de TVA, régime fiscal, taux de TVA, IRPF/withholding) sont déclarées et validées par la créatrice. L'agence ne fournit pas de conseil fiscal et décline toute responsabilité quant à l'exactitude de ces informations et à l'application des taux/mentions légales. La créatrice demeure seule responsable de la conformité de sa facturation et de ses obligations fiscales et sociales.
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>ES:</strong> Responsabilidad sobre datos fiscales — La información (estatus, NIF/CIF, números de IVA, régimen fiscal, tipos de IVA, IRPF/retención) es declarada y validada por la creadora. La agencia no presta asesoramiento fiscal y declina toda responsabilidad sobre la exactitud y la aplicación de tipos/leyendas. La creadora es única responsable del cumplimiento de su facturación y de sus obligaciones fiscales y sociales.
                        </div>
                        <div>
                            <strong>EN:</strong> Tax information responsibility — All tax data (status, tax/VAT IDs, VAT regimes, VAT rates, withholding) are provided and confirmed by the creator. The agency does not provide tax advice and accepts no liability for the accuracy or application of such data. The creator remains solely responsible for invoicing compliance and all tax/social obligations.
                        </div>
                    </div>

                    <!-- Banking Details -->
                    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Coordonnées bancaires:</h4>
                        <div style="font-size: 12px; line-height: 1.5;">
                            Banque: [Nom de la banque]<br/>
                            IBAN: [IBAN]<br/>
                            SWIFT/BIC: [BIC]
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        invoiceWindow.document.close();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Invoice Form */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('invoiceGenerator') || 'Générateur de Facture'}</h2>

                {/* User Billing Information Display */}
                {userBillingData && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Informations de facturation (chargées depuis la base de données)</h3>
                        <div className="text-sm text-blue-800">
                            <div><strong>Nom:</strong> {userBillingData.prenom && userBillingData.nom ? `${userBillingData.prenom} ${userBillingData.nom}` : userBillingData.companyName || 'Non spécifié'}</div>
                            <div><strong>Adresse:</strong> {userBillingData.address || 'Non spécifiée'}</div>
                            <div><strong>Localisation:</strong> {userBillingData.postalCode} {userBillingData.city}, {userBillingData.country}</div>
                            {userBillingData.siret && <div><strong>SIRET:</strong> {userBillingData.siret}</div>}
                            {userBillingData.tva && <div><strong>TVA:</strong> {userBillingData.tva}</div>}
                        </div>
                    </div>
                )}

                {/* Invoice Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
                        <input
                            type="text"
                            value={invoiceData.invoiceNumber}
                            onChange={(e) => handleInvoiceChange({ target: { name: 'invoiceNumber', value: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="F250001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de facturation</label>
                        <input
                            type="date"
                            value={invoiceData.date}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            title="La date est automatiquement définie à aujourd'hui"
                        />
                        <p className="text-xs text-gray-500 mt-1">Date automatiquement définie à aujourd'hui</p>
                    </div>
                </div>

                {/* TVA Regime Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Régime TVA</label>
                    <select
                        value={invoiceData.selectedRegime}
                        onChange={handleRegimeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {tvaRegimes.map(regime => (
                            <option key={regime.id} value={regime.id}>
                                {regime.name}
                            </option>
                        ))}
                    </select>
                    {selectedRegime && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <strong>Mention légale:</strong> {selectedRegime.legalMention}
                        </div>
                    )}
                </div>

                {/* Invoice Items Table */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Articles</h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                                + Ajouter
                            </button>
                            {invoiceData.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(invoiceData.items.length - 1)}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                    Supprimer le dernier
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Description</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium w-20">Quantité</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium w-32">Prix unitaire HT (€)</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium w-20">% TVA</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium w-32">Total TVA (€)</th>
                                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium w-32">Total TTC (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.items.map((item, index) => {
                                    const itemSubtotal = parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 1);
                                    const itemTva = itemSubtotal * (selectedRegime?.rate || 0) / 100;
                                    const itemTotal = itemSubtotal + itemTva;

                                    return (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-3 py-2">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                                    placeholder="Description de l'article"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-right">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unitPrice}
                                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                                                {selectedRegime?.rate || 0}%
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-right text-sm">
                                                {itemTva.toFixed(2)} €
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">
                                                {itemTotal.toFixed(2)} €
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Summary */}
                    <div className="mt-4 flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between py-1 border-b">
                                <span>Total HT:</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                                <span>Total TVA:</span>
                                <span>{tvaAmount.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between py-2 font-bold text-lg border-b-2 border-gray-400">
                                <span>Total TTC:</span>
                                <span>{totalTTC.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Disclaimer and Confirmation */}
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">⚠️ Responsabilité fiscale</h4>
                    <p className="text-sm text-red-800 mb-3">
                        Je confirme que les informations fiscales saisies sont exactes et que j'assume l'entière responsabilité de l'application des taux et mentions.
                    </p>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={invoiceData.confirmationChecked}
                            onChange={(e) => setInvoiceData({ ...invoiceData, confirmationChecked: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-sm text-red-800">
                            Je confirme avoir vérifié l'exactitude des informations fiscales
                        </span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={generateInvoice}
                        disabled={!invoiceData.confirmationChecked}
                        className="gradient-bg text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📄 Générer la Facture (PDF)
                    </button>
                </div>
            </div>


        </div>
    );
};

// Toolbox Component
const Toolbox = ({ user, toolboxMatrix, language }) => {
    const { t } = useTranslation(language);
    // Expect matrix where row 1: links, row 2: names, rows 3+: emails per column
    if (!toolboxMatrix || toolboxMatrix.length < 2) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('toolbox')}</h2>
                <p className="text-gray-600">{t('noTools')}</p>
            </div>
        );
    }

    const linksRow = toolboxMatrix[0] || [];
    const namesRow = toolboxMatrix[1] || [];
    const emailRows = toolboxMatrix.slice(2);
    const userEmail = (user?.email || '').toLowerCase();

    // Determine which columns apply to the current user
    const applicableColumns = linksRow.map((url, colIdx) => {
        if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) return null;
        const name = namesRow[colIdx] || `Link ${colIdx + 1}`;
        // Check if user's email appears in this column (rows 3+)
        const columnEmails = emailRows.map(r => (r[colIdx] || '').toLowerCase()).filter(Boolean);
        const isForUser = columnEmails.includes(userEmail);
        return isForUser ? { url, name } : null;
    }).filter(Boolean);

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('toolbox')}</h2>
                <p className="text-gray-600 mb-4">{t('toolboxIntro')}</p>
                {applicableColumns.length === 0 ? (
                    <p className="text-gray-500">{t('noTools')}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {applicableColumns.map((tool, idx) => (
                            <a
                                key={idx}
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                            >
                                <span className="font-medium text-blue-700 underline truncate mr-2">{tool.name}</span>
                                <span>↗</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Google Drive uploader */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <DriveUploader user={user} />
            </div>
        </div>
    );
};

const DriveUploader = ({ user }) => {
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const onUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage('');
        try {
            const arrayBuffer = await file.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            const res = await fetch('/.netlify/functions/drive-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    filename: file.name,
                    mimeType: file.type,
                    dataBase64: base64,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Upload completed ✓');
                setFile(null);
            } else {
                setMessage('Upload failed');
            }
        } catch (e) {
            setMessage('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Drive Uploads</h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto">
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                </div>
                <button 
                    onClick={onUpload} 
                    disabled={!file || uploading} 
                    className="w-full sm:w-auto gradient-bg text-white px-6 py-2 rounded-lg disabled:opacity-50 text-center"
                >
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
            </div>
            {message && (
                <p className={`text-sm mt-2 ${message.includes('✓') ? 'text-green-600 font-medium' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

// Available Users Component (for debugging/demo)
const AvailableUsers = ({ users, language }) => {
    const { t } = useTranslation(language);
    const [copiedEmail, setCopiedEmail] = useState('');

    const copyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(''), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('availableUserAccounts')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('availableUsersDesc')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="gradient-bg p-2 rounded-lg">
                                    <span className="text-white font-bold text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 truncate">{user.email}</span>
                                <button
                                    onClick={() => copyEmail(user.email)}
                                    className={`ml-2 px-2 py-1 text-xs rounded ${
                                        copiedEmail === user.email 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    }`}
                                >
                                    {copiedEmail === user.email ? t('copied') : t('copy')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">{t('loginInstructions')}</h3>
                    <ol className="text-sm text-blue-700 space-y-1">
                        <li>{t('copyAnyEmail')}</li>
                        <li>{t('logoutAndPaste')}</li>
                        <li>{t('enterAnyPassword')}</li>
                        <li>{t('viewDashboard')}</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

// Login Component with real email validation
const Login = ({ onLogin, availableUsers, language, toggleLanguage, loading }) => {
    const { t } = useTranslation(language);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError(t('enterBothFields'));
            return;
        }
        
        // Check if email exists in available users
        const user = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            setError(t('emailNotFound'));
            return;
        }
        
        // Clean up passwords by removing all whitespace and normalizing
        const cleanPassword = (pwd) => {
            const cleaned = (pwd || '').trim();
            return cleaned;
        };
        
        const userPassword = cleanPassword(user.password);
        const enteredPassword = cleanPassword(password);
        
        const hasSetPassword = !!userPassword;
        const passwordMatches = hasSetPassword ? userPassword === enteredPassword : true;
        
        // Debug logging for password validation

        
        // Check password validation
        if (hasSetPassword && !passwordMatches) {
            // User has a specific password set in Mail worksheet column B
            setError(t('invalidPassword'));
            return;
        }
        // If no password is set in Mail worksheet column B, any password works
        
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <img 
                        src="./logo.png.png" 
                        alt="Grapper Logo" 
                        className="w-20 h-20 mx-auto mb-4 object-contain"
                    />
                    <h2 className="text-3xl font-bold text-gray-900">{t('welcomeToGrapper')}</h2>
                    <p className="mt-2 text-gray-600">{t('signInAccess')}</p>
                    
                    {/* Language Toggle Button */}
                    <div className="mt-4">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
                        >
                            <span className="text-2xl">{language === 'en' ? '🇫🇷' : '🇬🇧'}</span>
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">{t('parsingGoogleSheet')}</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('emailAddress')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('enterEmail')}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('password')}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('enterPassword')}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full gradient-bg text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                            {t('signIn')}
                        </button>
                    </form>
                )}
                

            </div>
        </div>
    );
};

// Error Component
const ErrorDisplay = ({ error, onRetry, language }) => {
    const { t } = useTranslation(language);
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <img 
                    src="./logo.png.png" 
                    alt="Grapper Logo" 
                    className="w-20 h-20 mx-auto mb-4 object-contain"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('apiError')}</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={onRetry}
                    className="gradient-bg text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-left">
                    <h3 className="font-medium text-yellow-900 mb-2">Configuration Required:</h3>
                    <p className="text-sm text-yellow-700">
                        Please ensure your Google Sheets API is configured with:
                    </p>
                    <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                        <li>• Valid API Key</li>
                        <li>• Correct Spreadsheet ID</li>
                        <li>• Proper sharing permissions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en');
    const [lastUpdated, setLastUpdated] = useState(null);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'fr' : 'en');
    };

    const { t } = useTranslation(language);

    // Load Google Sheets data
    const loadSheetData = async (forceRefresh = false) => {
        try {

            setLoading(true);
            setError(null);
            
            let sheetData;
            if (forceRefresh) {
                sheetData = await googleSheetsService.refreshData();
            } else {
                sheetData = await googleSheetsService.fetchSheetData();
            }
            
            // Extract all campaigns and action events
            allCampaigns = transformSheetDataToCampaigns(sheetData);
            allActionEvents = buildActionEventsFromSheet(sheetData, googleSheetsService.getEventsMatrix());

            // Always use Mail sheet data for login (contains passwords)
            const loginData = googleSheetsService.getLoginData();
            
            // The serverless function should strip the header, but we'll double-check to prevent errors.
            const loginDataWithoutHeader = Array.isArray(loginData) && loginData.length > 0
                ? (normalizeString(loginData[0].email) === 'mail' ? loginData.slice(1) : loginData)
                : [];
            
            // Use login data with passwords.
            if (loginDataWithoutHeader.length > 0) {
                availableUsers = buildUsersFromLoginData(loginDataWithoutHeader, sheetData);
            } else {
                // Fallback for safety, though it should not be reached if the function works.
                availableUsers = extractUsersFromSheetData(sheetData);
            }
            // Capture toolbox matrix
            toolboxMatrix = googleSheetsService.getToolboxMatrix();
            
            setLastUpdated(Date.now());
            setLoading(false);
            
            // If user is logged in, refresh their campaigns
            if (currentUser) {
                const filtered = allCampaigns.filter(campaign => 
                    campaign.Influencer_Email.toLowerCase() === currentUser.email.toLowerCase()
                );
                setUserCampaigns(filtered);
                // Filter events by email
                const userEvents = allActionEvents.filter(e => (e.extendedProps?.email || '').toLowerCase() === currentUser.email.toLowerCase());
                setUserEvents(userEvents);
            }
            
        } catch (error) {
            console.error('Error loading Google Sheets data:', error);
            
            // Provide more specific error messages
            let errorMessage = error.message || 'Unknown error occurred';
            if (errorMessage.includes('403')) {
                errorMessage = 'API key access denied. Please check your Google Cloud Console API key restrictions and ensure your domain is authorized.';
            } else if (errorMessage.includes('400')) {
                errorMessage = 'Google Sheets access error. Please ensure your spreadsheet is shared as "Anyone with the link can view" and the sheet name/range is correct.';
            } else if (errorMessage.includes('FAILED_PRECONDITION') || errorMessage.includes('This operation is not supported')) {
                errorMessage = 'Invalid spreadsheet ID or document access error. Please verify your Google Sheets URL and ensure the document is a proper Google Sheets file.';
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Initial load on component mount
    useEffect(() => {
        // No API key validation needed - using secure serverless function
        loadSheetData();
    }, []);

    // Set up automatic refresh for notifications (separate effect)
    useEffect(() => {
        if (!currentUser) return;
        
        const interval = setInterval(() => {
            // Only refresh if user is logged in and not currently loading
            if (currentUser && !loading) {

                loadSheetData(true); // Force refresh to check for new events
            }
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, [currentUser]); // Only depend on currentUser, not loading

    const handleLogin = (user) => {
        setCurrentUser(user);
        
        // Filter campaigns for this specific user
        const filtered = allCampaigns.filter(campaign => 
            campaign.Influencer_Email.toLowerCase() === user.email.toLowerCase()
        );
        
        setUserCampaigns(filtered);
        const evts = allActionEvents.filter(e => (e.extendedProps?.email || '').toLowerCase() === user.email.toLowerCase());
        setUserEvents(evts);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserCampaigns([]);
        setCurrentTab('dashboard');
    };



    const handleRetry = () => {
        setError(null);
        loadSheetData();
    };

    if (error) {
        return <ErrorDisplay error={error} onRetry={handleRetry} language={language} />;
    }

    if (loading && !isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <img 
                        src="./logo.png.png" 
                        alt="Grapper Logo" 
                        className="w-20 h-20 mx-auto object-contain animate-pulse"
                    />
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} availableUsers={availableUsers} language={language} toggleLanguage={toggleLanguage} loading={loading} />;
    }

    const renderCurrentTab = () => {
        switch(currentTab) {
            case 'dashboard':
                return <Dashboard campaigns={userCampaigns} events={userEvents} language={language} />;
            case 'history':
                return <History campaigns={userCampaigns} language={language} />;
            case 'profile':
                return <Profile user={currentUser} campaigns={userCampaigns} language={language} />;
            case 'invoices':
                return <InvoiceGenerator user={currentUser} campaigns={userCampaigns} language={language} />;
            case 'toolbox':
                return <Toolbox user={currentUser} toolboxMatrix={toolboxMatrix} language={language} />;
            default:
                return <Dashboard campaigns={userCampaigns} events={userEvents} language={language} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation 
                user={currentUser} 
                onLogout={handleLogout} 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userCampaigns={userCampaigns}
                userEvents={userEvents}
                language={language}
                toggleLanguage={toggleLanguage}
                lastUpdated={lastUpdated}
            />
            
            <main className="p-6">
                <div className="max-w-6xl mx-auto">
                    {renderCurrentTab()}
                </div>
            </main>
        </div>
    );
};

// Render the app using React 18 createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 
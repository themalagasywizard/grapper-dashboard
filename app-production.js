const { useState, useEffect, useRef } = React;

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
        demoMode: "Production Mode - Live Google Sheet Data",
        validEmails: "Valid emails",
        anyPassword: "Password: any password works in demo mode",
        emailNotFound: "Email not found. Please check the \"Available Users\" list for valid emails.",
        enterBothFields: "Please enter both email and password",
        
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
        demoMode: "Mode production - Données en direct Google Sheet",
        validEmails: "E-mails valides",
        anyPassword: "Mot de passe : n'importe quel mot de passe fonctionne en mode démo",
        emailNotFound: "E-mail non trouvé. Veuillez vérifier la liste \"Utilisateurs disponibles\" pour les e-mails valides.",
        enterBothFields: "Veuillez saisir l'e-mail et le mot de passe",
        
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
                console.log('Using cached data');
                return this.lastFetch.data;
            }

            // Use secure Netlify serverless function
            console.log('Fetching data via secure serverless function...');
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

            console.log('Raw serverless function data:', {
                rows: rows.length,
                timestamp: result.timestamp
            });

            // Convert campaigns to object format
            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            console.log('Processed data:', {
                totalRows: data.length,
                sampleRow: data[0],
                headers: headers
            });

            // Capture login emails from serverless function (Mail sheet)
            this.loginEmails = Array.isArray(result.loginEmails) ? result.loginEmails : [];

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

    getToolboxMatrix() {
        return this.toolboxMatrix || [];
    }

    getEventsMatrix() {
        return this.eventsMatrix || [];
    }
}

// Create global instance
const googleSheetsService = new GoogleSheetsService();

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
    
    console.log('Extracting users from sheet data...');
    console.log('Sample row for debugging:', sheetData[0]);
    console.log('Available columns:', Object.keys(sheetData[0] || {}));
    
    sheetData.forEach((row, index) => {
        // Prefer Talent (A) if it contains an email, otherwise fall back to Mail
        const talentValue = row['Talent'] || '';
        const mailValue = row['Mail'] || '';
        const email = (talentValue.includes('@') ? talentValue : mailValue).trim();
        const talent = talentValue; // may be email in new DB
        
        if (index < 5) {
            console.log(`Row ${index}: Email="${email}", Talent="${talent}", Full row keys:`, Object.keys(row));
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
    console.log('Extracted users:', users);
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

        const makeEvent = (isoDate, actionType) => ({
            id: `evt_${index}_${actionType}`,
            title: `${brand}`,
            date: isoDate,
            backgroundColor: actionType === 'Preview' ? '#f59e0b' : actionType === 'Post' ? '#3b82f6' : colorForStatus(status),
            borderColor: 'transparent',
            textColor: '#ffffff',
            extendedProps: {
                brand,
                status,
                actionType,
                email,
                talent
            }
        });

        const dPreview = convertFrenchDate(preview);
        if (dPreview) {
            events.push(makeEvent(dPreview, 'Preview'));
        }
        const dPost = convertFrenchDate(post);
        if (dPost) {
            events.push(makeEvent(dPost, 'Post'));
        }
    });

    // Parse Events worksheet: A=email, B=date, D=start time, E=end time, F=brand
    if (Array.isArray(rawEventsMatrix) && rawEventsMatrix.length > 1) {
        const header = rawEventsMatrix[0];
        const rows = rawEventsMatrix.slice(1);
        const idx = (name) => header.findIndex(h => (h || '').toLowerCase() === name.toLowerCase());
        const cEmail = idx('email') !== -1 ? idx('email') : 0; // fallback A
        const cDate = idx('date') !== -1 ? idx('date') : 1; // fallback B
        const cStart = idx('start') !== -1 ? idx('start') : 3; // fallback D
        const cEnd = idx('end') !== -1 ? idx('end') : 4; // fallback E
        const cBrand = idx('brand') !== -1 ? idx('brand') : 5; // fallback F

        rows.forEach((r, rIdx) => {
            const email = (r[cEmail] || '').trim();
            const dateStr = (r[cDate] || '').trim();
            const startStr = (r[cStart] || '').trim();
            const brand = (r[cBrand] || '').trim();
            if (!email || !dateStr || !brand) return;
            // Build ISO date (YYYY-MM-DD from possible DD/MM/YYYY)
            const isoDate = convertFrenchDate(dateStr) || dateStr;
            const iso = startStr ? `${isoDate}T${startStr}` : isoDate;
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
                    talent: ''
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

// Header Navigation Component
const Navigation = ({ user, onLogout, currentTab, setCurrentTab, userCampaigns, language, toggleLanguage, lastUpdated, onRefresh }) => {
    const { t } = useTranslation(language);
    const totalRevenue = userCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <img 
                            src="./logograpper.jpg" 
                            alt="Grapper Logo" 
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Grapper</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh data from Google Sheets"
                        >
                            <span className="text-lg">🔄</span>
                        </button>
                        
                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
                        >
                            <span className="text-2xl">{language === 'en' ? '🇫🇷' : '🇬🇧'}</span>
                        </button>
                        
                        <div className="text-right hidden sm:block">
                            <span className="text-gray-700 block">{t('welcome')}, {user.name}</span>
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
                
                {/* Tab Navigation */}
                <div className="flex space-x-6 -mb-px overflow-x-auto whitespace-nowrap pb-1">
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
            // Prepare all events for calendar
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of today
            
            // All events for calendar view (including past events)
            const allEvents = campaigns.map(campaign => {
                const isCompleted = campaign.Status === 'Completed';
                const backgroundColor = isCompleted ? '#22c55e' : '#6366f1'; // Green for completed, purple for upcoming
                
                console.log(`Calendar Event: ${campaign.Brand_Name} - Status: "${campaign.Status}" - Color: ${backgroundColor}`);
                
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
                        console.log('View type detection fallback, using default:', currentView);
                    }
                    
                    if (currentView === 'upcomingList') {
                        // For list view: only upcoming events from today onwards, sorted chronologically
                        const upcomingEvents = (Array.isArray(events) ? events : [])
                            .filter(event => new Date(event.date) >= today)
                            .sort((a, b) => new Date(a.date) - new Date(b.date));
                        console.log(`List view: Showing ${upcomingEvents.length} upcoming events`);
                        successCallback(upcomingEvents);
                    } else {
                        // For calendar view (dayGridMonth): ALL events (past and future)
                        const allProvided = Array.isArray(events) ? events : [];
                        console.log(`Calendar view (${currentView}): Showing ${allProvided.length} total events (past and future)`);
                        successCallback(allProvided);
                    }
                },
                eventClick: function(info) {
                    const campaign = campaigns.find(c => c.Campaign_ID === info.event.id);
                    if (campaign) {
                        alert(`${t('marque')}: ${campaign.Brand_Name}\n${t('deadline')}: ${campaign.Date}\n${t('myRevenue')}: €${campaign.Revenue.toLocaleString()}\n${t('status')}: ${campaign.Status}\n${t('description')}: ${campaign.Description || t('noDescription')}`);
                    }
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
                    // Enforce colors so nothing overrides them, based on action type
                    try {
                        const type = (info.event.extendedProps && info.event.extendedProps.actionType) || '';
                        let enforcedBg = null;
                        if (type === 'Preview') enforcedBg = '#f59e0b'; // orange
                        else if (type === 'Post') enforcedBg = '#3b82f6'; // blue
                        else if (type === 'Event') enforcedBg = '#8b5cf6'; // purple
                        else if (info.event.backgroundColor) enforcedBg = info.event.backgroundColor;
                        if (enforcedBg) {
                            info.el.style.backgroundColor = enforcedBg;
                            info.el.style.borderColor = 'transparent';
                            info.el.style.color = '#ffffff';
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
                                    <small style="color: #6b7280;">€${campaign.Revenue.toLocaleString()} • ${campaign.Status}</small>`;
                            }
                        }
                    }
                }
            });
            
            calendarInstance.current.render();
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
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
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
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        amount: campaigns.reduce((sum, c) => sum + c.Revenue, 0).toFixed(2),
        description: t('invoiceDescription') || 'Campaign Collaboration Services',
        agentName: t('agentName') || 'Grapper Agency',
        agentAddress: t('agentAddress') || '123 Agency Street, Paris, France'
    });

    const handleChange = (e) => {
        setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
    };

    const generateInvoice = () => {
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(`
            <html>
            <head>
                <title>Invoice ${invoiceData.invoiceNumber}</title>
                <style>
                    @media screen {
                        body { font-family: Arial, sans-serif; margin: 2cm; }
                        .no-print { display: block; }
                        .button-container { 
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            display: flex;
                            gap: 10px;
                        }
                        .action-button {
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: opacity 0.2s;
                        }
                        .action-button:hover {
                            opacity: 0.9;
                        }
                        .save-pdf {
                            background-color: #2563eb;
                            color: white;
                        }
                        .print {
                            background-color: #059669;
                            color: white;
                        }
                    }
                    @media print {
                        .no-print { display: none; }
                        body { margin: 0; padding: 20px; }
                    }
                    .header { text-align: center; margin-bottom: 2cm; }
                    .details { margin-bottom: 1cm; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 1cm; }
                    .table th, .table td { border: 1px solid #ddd; padding: 8px; }
                    .total { text-align: right; font-weight: bold; margin-bottom: 1cm; }
                    .footer { text-align: center; color: #666; font-size: 0.9em; }
                </style>
                <script>
                    function printInvoice() {
                        window.print();
                    }
                    
                    function savePDF() {
                        document.querySelector('.button-container').style.display = 'none';
                        window.print();
                        document.querySelector('.button-container').style.display = 'flex';
                    }
                </script>
            </head>
            <body>
                <div class="no-print button-container">
                    <button onclick="savePDF()" class="action-button save-pdf">💾 Save as PDF</button>
                    <button onclick="printInvoice()" class="action-button print">🖨️ Print</button>
                </div>
                
                <div class="header">
                    <h1>Invoice</h1>
                    <p>From: ${user.name} (${user.email})</p>
                    <p>To: ${invoiceData.agentName}</p>
                    <p>Address: ${invoiceData.agentAddress}</p>
                </div>
                <div class="details">
                    <p>Invoice Number: ${invoiceData.invoiceNumber}</p>
                    <p>Date: ${invoiceData.date}</p>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${invoiceData.description}</td>
                            <td>${invoiceData.amount}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="total">Total: €${invoiceData.amount}</p>
                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>Generated via Grapper Dashboard</p>
                </div>
            </body>
            </html>
        `);
        invoiceWindow.document.close();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('invoiceGenerator') || 'Generate Invoice'}</h2>
    
                
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoiceNumber') || 'Invoice Number'}</label>
                        <input
                            type="text"
                            name="invoiceNumber"
                            value={invoiceData.invoiceNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('date') || 'Date'}</label>
                        <input
                            type="date"
                            name="date"
                            value={invoiceData.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount') || 'Amount (€)'}</label>
                        <input
                            type="number"
                            name="amount"
                            value={invoiceData.amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('description') || 'Description'}</label>
                        <textarea
                            name="description"
                            value={invoiceData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('agentName') || 'Agent Name'}</label>
                        <input
                            type="text"
                            name="agentName"
                            value={invoiceData.agentName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('agentAddress') || 'Agent Address'}</label>
                        <input
                            type="text"
                            name="agentAddress"
                            value={invoiceData.agentAddress}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <button
                        type="button"
                        onClick={generateInvoice}
                        className="gradient-bg text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {t('generateInvoice') || 'Generate & Preview Invoice'}
                    </button>
                </form>
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
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('toolbox')}</h2>
                <p className="text-gray-600 mb-4">{t('toolboxIntro')}</p>
                {applicableColumns.length === 0 ? (
                    <p className="text-gray-500">{t('noTools')}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {applicableColumns.map((tool, idx) => (
                            <a
                                key={idx}
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                            >
                                <span className="font-medium text-blue-700 underline truncate">{tool.name}</span>
                                <span>↗</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Google Drive uploader */}
            <DriveUploader user={user} />
        </div>
    );
};

const DriveUploader = ({ user }) => {
    const [folder, setFolder] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fetchFolder = async () => {
            try {
                const res = await fetch(`/.netlify/functions/drive-upload?email=${encodeURIComponent(user.email)}`);
                const data = await res.json();
                if (data.success) setFolder(data.folder);
            } catch (_) {}
        };
        fetchFolder();
    }, [user.email]);

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
                setMessage('Uploaded successfully');
                setFile(null);
                setFolder(null);
                // Refresh folder
                const res2 = await fetch(`/.netlify/functions/drive-upload?email=${encodeURIComponent(user.email)}`);
                const data2 = await res2.json();
                if (data2.success) setFolder(data2.folder);
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
            {folder && (
                <p className="text-sm text-gray-600 mb-4">Your folder: <a className="text-blue-600 underline" href={folder.webViewLink} target="_blank" rel="noreferrer">Open in Drive</a></p>
            )}
            <div className="flex items-center gap-3">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button onClick={onUpload} disabled={!file || uploading} className="gradient-bg text-white px-4 py-2 rounded-lg disabled:opacity-50">
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
            </div>
            {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
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
        
        // For demo purposes, any password works
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <img 
                        src="./logograpper.jpg" 
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
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center mb-2">
                        <strong>{t('demoMode')}</strong>
                    </p>
                    {!loading && availableUsers.length > 0 && (
                        <p className="text-xs text-blue-600 text-center">
                            {t('validEmails')}: {availableUsers.slice(0, 3).map(u => u.email).join(', ')}<br />
                            {t('anyPassword')}
                        </p>
                    )}
                </div>
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
                    src="./logograpper.jpg" 
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

            // Prefer dedicated Mail sheet for login emails if provided
            const loginEmails = googleSheetsService.getLoginEmails();
            if (Array.isArray(loginEmails) && loginEmails.length > 0) {
                availableUsers = buildUsersFromLoginEmails(loginEmails, sheetData);
            } else {
                // Fallback to deriving users from main sheet
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

    const handleRefresh = () => {
        loadSheetData(true);
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
                        src="./logograpper.jpg" 
                        alt="Grapper Logo" 
                        className="w-20 h-20 mx-auto mb-4 object-contain animate-pulse"
                    />
                    <h2 className="text-xl font-bold text-gray-900">{t('loadingCampaignData')}</h2>
                    <p className="text-gray-600">{t('parsingGoogleSheet')}</p>
                    <div className="mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
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
                language={language}
                toggleLanguage={toggleLanguage}
                lastUpdated={lastUpdated}
                onRefresh={handleRefresh}
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
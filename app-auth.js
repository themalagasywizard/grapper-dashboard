const { useState, useEffect, useRef } = React;

// CSV Parser Function
const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }
    return data;
};

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

// Extract unique users from CSV data
const extractUsersFromCSV = (csvData) => {
    const usersMap = new Map();
    
    csvData.forEach(row => {
        const email = row['Mail'];
        const talent = row['Talent'];
        
        // Only process rows with valid email addresses (not empty, not #N/A)
        if (email && email.trim() !== '' && email !== '#N/A' && email.includes('@')) {
            if (!usersMap.has(email)) {
                usersMap.set(email, {
                    email: email.trim(),
                    name: talent.trim(),
                    joinDate: convertFrenchDate(row['Date Création']) || '2024-01-01'
                });
            }
        }
    });
    
    return Array.from(usersMap.values());
};

// Data transformation function
const transformCSVToCampaigns = (csvData) => {
    return csvData
        .filter(row => row['Talent'] && row['Marque'] && row['Date Fin']) // Only rows with required data
        .map((row, index) => {
            const dateFin = convertFrenchDate(row['Date Fin']);
            if (!dateFin) return null;
            
            const userEmail = row['Mail'] && row['Mail'] !== '#N/A' && row['Mail'].includes('@') 
                ? row['Mail'].trim() 
                : `${row['Talent']?.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            
            return {
                Campaign_ID: `csv_${index}`,
                Talent: row['Talent'] || '',
                Influencer_Email: userEmail,
                Date: dateFin,
                Brand_Name: row['Marque'] || '',
                Revenue: cleanCurrency(row['Rémunération totale']),
                Status: row['Status'] === 'Fait' ? 'Completed' : 'Upcoming',
                DateCreation: convertFrenchDate(row['Date Création']),
                Description: row['Description rapide de la demande'] || '',
                Format: row['Format (influence vs UGC)'] || '',
                Commission: cleanCurrency(row['Commission']),
                OriginalData: row // Keep original for reference
            };
        })
        .filter(campaign => campaign !== null); // Remove invalid entries
};

// Main data state
let allCampaigns = [];
let availableUsers = [];
let currentUser = null;

// Header Navigation Component
const Navigation = ({ user, onLogout, currentTab, setCurrentTab, userCampaigns }) => {
    const totalRevenue = userCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <div className="gradient-bg p-2 rounded-lg">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Grapper</h1>
                            <p className="text-sm text-gray-500">
                                {currentTab === 'dashboard' && 'Dashboard'}
                                {currentTab === 'history' && 'Collaboration History'}
                                {currentTab === 'profile' && 'Profile'}
                                {currentTab === 'users' && 'Available Users'}
                                {userCampaigns.length > 0 && ` • ${userCampaigns.length} campaigns • €${totalRevenue.toLocaleString()}`}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 hidden sm:inline">Welcome, {user.name}</span>
                        <button 
                            onClick={onLogout}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex space-x-8 -mb-px">
                    <button
                        onClick={() => setCurrentTab('dashboard')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            currentTab === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📅 Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentTab('history')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            currentTab === 'history'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📋 History
                    </button>
                    <button
                        onClick={() => setCurrentTab('profile')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            currentTab === 'profile'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        👤 Profile
                    </button>
                    <button
                        onClick={() => setCurrentTab('users')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            currentTab === 'users'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        🔐 Available Users
                    </button>
                </div>
            </div>
        </header>
    );
};

// Dashboard Component with Calendar (filtered for user)
const Dashboard = ({ campaigns }) => {
    const calendarRef = useRef(null);
    const calendarInstance = useRef(null);
    
    const upcomingCampaigns = campaigns.filter(c => c.Status === 'Upcoming');
    const thisMonthRevenue = upcomingCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    useEffect(() => {
        if (calendarRef.current && !calendarInstance.current && window.FullCalendar) {
            // Prepare events for calendar using Date Fin
            const events = campaigns.map(campaign => ({
                id: campaign.Campaign_ID,
                title: `${campaign.Brand_Name}`,
                date: campaign.Date, // This is the Date Fin
                extendedProps: {
                    revenue: campaign.Revenue,
                    talent: campaign.Talent,
                    status: campaign.Status
                },
                backgroundColor: campaign.Status === 'Completed' ? '#10b981' : '#6366f1',
                borderColor: 'transparent',
                textColor: '#ffffff'
            }));

            calendarInstance.current = new FullCalendar.Calendar(calendarRef.current, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek'
                },
                events: events,
                eventClick: function(info) {
                    const campaign = campaigns.find(c => c.Campaign_ID === info.event.id);
                    if (campaign) {
                        alert(`Brand: ${campaign.Brand_Name}\nDeadline: ${campaign.Date}\nRevenue: €${campaign.Revenue.toLocaleString()}\nStatus: ${campaign.Status}\nDescription: ${campaign.Description || 'No description'}`);
                    }
                },
                height: 'auto',
                eventDisplay: 'block'
            });
            
            calendarInstance.current.render();
        }
        
        return () => {
            if (calendarInstance.current) {
                calendarInstance.current.destroy();
                calendarInstance.current = null;
            }
        };
    }, [campaigns]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">My Total Campaigns</p>
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
                            <p className="text-sm font-medium text-gray-600">Upcoming Campaigns</p>
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
                            <p className="text-sm font-medium text-gray-600">My Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">€{campaigns.reduce((sum, c) => sum + c.Revenue, 0).toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Campaign Calendar (Date Fin)</h2>
                <div ref={calendarRef} className="calendar-container"></div>
            </div>

            {/* Quick View - Recent Campaigns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Recent Campaigns</h2>
                {campaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No campaigns found for your account.</p>
                        <p className="text-sm">Check the "Available Users" tab to see valid email addresses.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {campaigns.slice(0, 5).map((campaign) => (
                            <div key={campaign.Campaign_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="gradient-bg p-2 rounded-lg">
                                        <span className="text-white font-bold">{campaign.Brand_Name[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{campaign.Brand_Name}</h3>
                                        <p className="text-sm text-gray-500">Deadline: {campaign.Date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">€{campaign.Revenue.toLocaleString()}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        campaign.Status === 'Completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {campaign.Status}
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
const History = ({ campaigns }) => {
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
        const headers = ['Marque', 'Date Fin', 'Rémunération totale', 'Status', 'Description'];
        const csvData = [
            headers.join(','),
            ...sortedCampaigns.map(campaign => 
                [campaign.Brand_Name, campaign.Date, campaign.Revenue, campaign.Status, campaign.Description].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(url);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_grapper_campaigns.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">My Campaigns</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">📊</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900">{completedCampaigns.length}</p>
                        </div>
                        <div className="gradient-bg-success p-3 rounded-lg">
                            <span className="text-white text-xl">✅</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">My Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">€{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💎</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">€{Math.round(totalRevenue / campaigns.length || 0).toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">📈</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All My Campaigns</option>
                            <option value="completed">Completed</option>
                            <option value="upcoming">Upcoming</option>
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
                            <option value="date-desc">Date Fin (Newest First)</option>
                            <option value="date-asc">Date Fin (Oldest First)</option>
                            <option value="brand-asc">Marque (A-Z)</option>
                            <option value="brand-desc">Marque (Z-A)</option>
                            <option value="revenue-desc">Revenue (High to Low)</option>
                            <option value="revenue-asc">Revenue (Low to High)</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={exportToCSV}
                        className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Export My Data
                    </button>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">My Campaign History</h2>
                </div>
                
                {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No campaigns found for your account.</p>
                        <p className="text-sm mt-2">Please contact your agency administrator if you believe this is an error.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque (Brand)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin (Deadline)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rémunération totale</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                                {campaign.Status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedCampaigns.length)} of {sortedCampaigns.length} results
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Profile Component
const Profile = ({ user, campaigns }) => {
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start space-x-6">
                    <div className="gradient-bg p-6 rounded-full">
                        <span className="text-white text-3xl font-bold">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600 mb-2">{user.email}</p>
                        <p className="text-sm text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Active Influencer
                            </span>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="gradient-bg p-3 rounded-lg inline-block mb-3">
                            <span className="text-white text-xl">🏆</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                        <p className="text-sm text-gray-600">My Campaigns</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="gradient-bg-success p-3 rounded-lg inline-block mb-3">
                            <span className="text-white text-xl">✅</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{completedCampaigns.length}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="gradient-bg-light p-3 rounded-lg inline-block mb-3">
                            <span className="text-white text-xl">💰</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">€{totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Earned</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="gradient-bg p-3 rounded-lg inline-block mb-3">
                            <span className="text-white text-xl">📊</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">€{Math.round(avgRevenue).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Avg per Campaign</p>
                    </div>
                </div>
            </div>

            {/* Top Brands */}
            {sortedBrands.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Top Brands by Revenue</h2>
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

// Available Users Component (for debugging/demo)
const AvailableUsers = ({ users }) => {
    const [copiedEmail, setCopiedEmail] = useState('');

    const copyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(''), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available User Accounts</h2>
                <p className="text-gray-600 mb-6">
                    These are the influencer accounts available in the system. 
                    Use any of these email addresses to login (password can be anything for demo).
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
                                    {copiedEmail === user.email ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Login Instructions:</h3>
                    <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. Copy any email address above</li>
                        <li>2. Logout and paste the email in the login form</li>
                        <li>3. Enter any password (demo mode)</li>
                        <li>4. View that influencer's personalized dashboard</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

// Login Component with real email validation
const Login = ({ onLogin, availableUsers }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        // Check if email exists in available users
        const user = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            setError('Email not found. Please check the "Available Users" list for valid emails.');
            return;
        }
        
        // For demo purposes, any password works
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="gradient-bg p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome to Grapper</h2>
                    <p className="mt-2 text-gray-600">Sign in to access your influencer dashboard</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
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
                        Sign In
                    </button>
                </form>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center mb-2">
                        <strong>Demo Mode - Real Google Sheet Data</strong>
                    </p>
                    <p className="text-xs text-blue-600 text-center">
                        Valid emails: orane.baron1403@gmail.com, pauline@grapperagency.com, lilyy.nl@grapperagency.com<br />
                        Password: any password works in demo mode
                    </p>
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
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load CSV data on component mount
    useEffect(() => {
        const loadCSVData = async () => {
            try {
                const response = await fetch('./Global Suivi Campagnes (11).xlsx - Global1.csv');
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                
                // Extract all campaigns and users
                allCampaigns = transformCSVToCampaigns(parsedData);
                availableUsers = extractUsersFromCSV(parsedData);
                
                setCsvData(parsedData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading CSV:', error);
                setLoading(false);
            }
        };

        loadCSVData();
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        
        // Filter campaigns for this specific user
        const filtered = allCampaigns.filter(campaign => 
            campaign.Influencer_Email.toLowerCase() === user.email.toLowerCase()
        );
        
        setUserCampaigns(filtered);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserCampaigns([]);
        setCurrentTab('dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="gradient-bg p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Loading campaign data...</h2>
                    <p className="text-gray-600">Parsing Google Sheet CSV and extracting user accounts</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} availableUsers={availableUsers} />;
    }

    const renderCurrentTab = () => {
        switch(currentTab) {
            case 'dashboard':
                return <Dashboard campaigns={userCampaigns} />;
            case 'history':
                return <History campaigns={userCampaigns} />;
            case 'profile':
                return <Profile user={currentUser} campaigns={userCampaigns} />;
            case 'users':
                return <AvailableUsers users={availableUsers} />;
            default:
                return <Dashboard campaigns={userCampaigns} />;
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
            />
            
            <main className="p-6">
                <div className="max-w-6xl mx-auto">
                    {renderCurrentTab()}
                </div>
            </main>
        </div>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root')); 
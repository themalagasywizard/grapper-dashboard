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

// Data transformation function
const transformCSVToCampaigns = (csvData, selectedTalent = 'Sarah Johnson') => {
    return csvData
        .filter(row => row['Talent'] && row['Marque'] && row['Date Fin']) // Only rows with required data
        .map((row, index) => {
            const dateFin = convertFrenchDate(row['Date Fin']);
            if (!dateFin) return null;
            
            return {
                Campaign_ID: `csv_${index}`,
                Talent: row['Talent'] || '',
                Influencer_Email: `${row['Talent']?.toLowerCase().replace(' ', '.')}@example.com`,
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

// Mock user for demo (this would come from authentication)
const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    joinDate: '2024-06-15',
    totalEarnings: 0
};

// Main data state
let campaignsData = [];
let currentUserCampaigns = [];

// Header Navigation Component
const Navigation = ({ user, onLogout, currentTab, setCurrentTab, totalCampaigns, totalRevenue }) => {
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
                                {totalCampaigns > 0 && ` • ${totalCampaigns} campaigns • €${totalRevenue.toLocaleString()}`}
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
                        onClick={() => setCurrentTab('data')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            currentTab === 'data'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📊 Data Debug
                    </button>
                </div>
            </div>
        </header>
    );
};

// Dashboard Component with Calendar
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
                title: `${campaign.Brand_Name} (${campaign.Talent})`,
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
                        alert(`Brand: ${campaign.Brand_Name}\nTalent: ${campaign.Talent}\nDeadline: ${campaign.Date}\nRevenue: €${campaign.Revenue.toLocaleString()}\nStatus: ${campaign.Status}`);
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
                            <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
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
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Calendar (Date Fin)</h2>
                <div ref={calendarRef} className="calendar-container"></div>
            </div>

            {/* Quick View - Recent Campaigns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Campaigns</h2>
                <div className="space-y-3">
                    {campaigns.slice(0, 5).map((campaign) => (
                        <div key={campaign.Campaign_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="gradient-bg p-2 rounded-lg">
                                    <span className="text-white font-bold">{campaign.Brand_Name[0]}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{campaign.Brand_Name}</h3>
                                    <p className="text-sm text-gray-500">Deadline: {campaign.Date} • {campaign.Talent}</p>
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
            </div>
        </div>
    );
};

// History Component
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
        const headers = ['Marque', 'Date Fin', 'Rémunération totale', 'Talent', 'Status'];
        const csvData = [
            headers.join(','),
            ...sortedCampaigns.map(campaign => 
                [campaign.Brand_Name, campaign.Date, campaign.Revenue, campaign.Talent, campaign.Status].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grapper_campaign_history.csv';
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
                            <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
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
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
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
                            <option value="all">All Campaigns</option>
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
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Campaign History</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque (Brand)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin (Deadline)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rémunération totale</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talent</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.Talent}</td>
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
                        <p className="text-sm text-gray-600">Total Campaigns</p>
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Brands by Revenue</h2>
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
        </div>
    );
};

// Data Debug Component
const DataDebug = ({ campaigns, csvData }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Data Debug Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">CSV Data Stats</h3>
                        <p className="text-sm text-gray-600">Total rows in CSV: {csvData?.length || 0}</p>
                        <p className="text-sm text-gray-600">Processed campaigns: {campaigns.length}</p>
                        <p className="text-sm text-gray-600">With valid dates: {campaigns.filter(c => c.Date).length}</p>
                        <p className="text-sm text-gray-600">With revenue: {campaigns.filter(c => c.Revenue > 0).length}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Sample Data</h3>
                        {campaigns.slice(0, 3).map((campaign, index) => (
                            <div key={index} className="text-xs text-gray-600 mb-2 p-2 bg-gray-50 rounded">
                                <strong>{campaign.Brand_Name}</strong><br />
                                Date: {campaign.Date}<br />
                                Revenue: €{campaign.Revenue}
                            </div>
                        ))}
                    </div>
                </div>
                
                {csvData && csvData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Raw CSV Headers</h3>
                        <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded overflow-x-auto">
                            {Object.keys(csvData[0]).join(', ')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Login Component
const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            onLogin();
        }
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

                    <button
                        type="submit"
                        className="w-full gradient-bg text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                        Demo Mode: Use any email and password to login<br />
                        <strong>Using real CSV data from Google Sheet!</strong>
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
    const [campaigns, setCampaigns] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load CSV data on component mount
    useEffect(() => {
        const loadCSVData = async () => {
            try {
                const response = await fetch('./Global Suivi Campagnes (11).xlsx - Global1.csv');
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                const transformedCampaigns = transformCSVToCampaigns(parsedData);
                
                setCsvData(parsedData);
                setCampaigns(transformedCampaigns);
                setLoading(false);
            } catch (error) {
                console.error('Error loading CSV:', error);
                setLoading(false);
            }
        };

        loadCSVData();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
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
                    <p className="text-gray-600">Parsing Google Sheet CSV</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const totalRevenue = campaigns.reduce((sum, c) => sum + c.Revenue, 0);

    const renderCurrentTab = () => {
        switch(currentTab) {
            case 'dashboard':
                return <Dashboard campaigns={campaigns} />;
            case 'history':
                return <History campaigns={campaigns} />;
            case 'profile':
                return <Profile user={mockUser} campaigns={campaigns} />;
            case 'data':
                return <DataDebug campaigns={campaigns} csvData={csvData} />;
            default:
                return <Dashboard campaigns={campaigns} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation 
                user={mockUser} 
                onLogout={handleLogout} 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                totalCampaigns={campaigns.length}
                totalRevenue={totalRevenue}
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
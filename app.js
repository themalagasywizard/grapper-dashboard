const { useState, useEffect, useRef } = React;
const { BrowserRouter: Router, Routes, Route, Link, useNavigate, useLocation } = ReactRouterDOM;

// Mock data that matches the PRD structure
const mockCampaigns = [
    {
        Campaign_ID: '001',
        Influencer_Email: 'sarah@example.com',
        Date: '2025-01-15',
        Brand_Name: 'Nike',
        Revenue: 5000,
        Status: 'Upcoming'
    },
    {
        Campaign_ID: '002',
        Influencer_Email: 'sarah@example.com',
        Date: '2025-01-22',
        Brand_Name: 'Adidas',
        Revenue: 3500,
        Status: 'Upcoming'
    },
    {
        Campaign_ID: '003',
        Influencer_Email: 'sarah@example.com',
        Date: '2025-02-05',
        Brand_Name: 'Spotify',
        Revenue: 2800,
        Status: 'Upcoming'
    },
    {
        Campaign_ID: '004',
        Influencer_Email: 'sarah@example.com',
        Date: '2024-12-10',
        Brand_Name: 'Coca-Cola',
        Revenue: 4200,
        Status: 'Completed'
    },
    {
        Campaign_ID: '005',
        Influencer_Email: 'sarah@example.com',
        Date: '2024-11-28',
        Brand_Name: 'Apple',
        Revenue: 7500,
        Status: 'Completed'
    },
    {
        Campaign_ID: '006',
        Influencer_Email: 'sarah@example.com',
        Date: '2024-11-15',
        Brand_Name: 'Samsung',
        Revenue: 6200,
        Status: 'Completed'
    }
];

const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    joinDate: '2024-06-15',
    totalEarnings: 29200
};

// Header Navigation Component
const Navigation = ({ user, onLogout }) => {
    const location = useLocation();
    
    const getPageTitle = () => {
        switch(location.pathname) {
            case '/': return 'Dashboard';
            case '/history': return 'Collaboration History';
            case '/profile': return 'Profile';
            default: return 'Dashboard';
        }
    };

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
                            <p className="text-sm text-gray-500">{getPageTitle()}</p>
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
            </div>
        </header>
    );
};

// Sidebar Navigation Component
const Sidebar = () => {
    const location = useLocation();
    
    const navItems = [
        { path: '/', icon: '📅', label: 'Dashboard', desc: 'View upcoming campaigns' },
        { path: '/history', icon: '📋', label: 'History', desc: 'Past collaborations' },
        { path: '/profile', icon: '👤', label: 'Profile', desc: 'Account settings' }
    ];

    return (
        <nav className="bg-white shadow-sm h-full">
            <div className="p-6">
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                                location.pathname === item.path
                                    ? 'gradient-bg text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <div>
                                <div className="font-medium">{item.label}</div>
                                <div className={`text-sm ${
                                    location.pathname === item.path ? 'text-white/80' : 'text-gray-500'
                                }`}>
                                    {item.desc}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

// Dashboard Component with Calendar
const Dashboard = ({ campaigns }) => {
    const calendarRef = useRef(null);
    const calendarInstance = useRef(null);
    
    const upcomingCampaigns = campaigns.filter(c => c.Status === 'Upcoming');
    const thisMonthRevenue = upcomingCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    
    useEffect(() => {
        if (calendarRef.current && !calendarInstance.current) {
            // Prepare events for calendar
            const events = upcomingCampaigns.map(campaign => ({
                id: campaign.Campaign_ID,
                title: campaign.Brand_Name,
                date: campaign.Date,
                extendedProps: {
                    revenue: campaign.Revenue
                },
                backgroundColor: 'transparent',
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
                    const campaign = upcomingCampaigns.find(c => c.Campaign_ID === info.event.id);
                    if (campaign) {
                        alert(`Brand: ${campaign.Brand_Name}\nDate: ${campaign.Date}\nRevenue: $${campaign.Revenue.toLocaleString()}`);
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
    }, [upcomingCampaigns]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Upcoming Campaigns</p>
                            <p className="text-3xl font-bold text-gray-900">{upcomingCampaigns.length}</p>
                        </div>
                        <div className="gradient-bg p-3 rounded-lg">
                            <span className="text-white text-xl">🚀</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Expected Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">${thisMonthRevenue.toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-success p-3 rounded-lg">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Next Campaign</p>
                            <p className="text-lg font-bold text-gray-900">
                                {upcomingCampaigns.length > 0 ? upcomingCampaigns[0].Brand_Name : 'None'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {upcomingCampaigns.length > 0 ? upcomingCampaigns[0].Date : '-'}
                            </p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">⭐</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Calendar</h2>
                <div ref={calendarRef} className="calendar-container"></div>
            </div>

            {/* Quick View - Next 3 Campaigns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Campaigns</h2>
                <div className="space-y-3">
                    {upcomingCampaigns.slice(0, 3).map((campaign) => (
                        <div key={campaign.Campaign_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="gradient-bg p-2 rounded-lg">
                                    <span className="text-white font-bold">{campaign.Brand_Name[0]}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{campaign.Brand_Name}</h3>
                                    <p className="text-sm text-gray-500">{campaign.Date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">${campaign.Revenue.toLocaleString()}</p>
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    {campaign.Status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {upcomingCampaigns.length > 3 && (
                    <div className="mt-4 text-center">
                        <Link to="/history" className="text-blue-600 hover:text-blue-800 font-medium">
                            View all campaigns →
                        </Link>
                    </div>
                )}
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
    const itemsPerPage = 5;

    const completedCampaigns = campaigns.filter(c => c.Status === 'Completed');
    const totalRevenue = completedCampaigns.reduce((sum, c) => sum + c.Revenue, 0);

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
        const headers = ['Date', 'Brand Name', 'Revenue', 'Status'];
        const csvData = [
            headers.join(','),
            ...sortedCampaigns.map(campaign => 
                [campaign.Date, campaign.Brand_Name, campaign.Revenue, campaign.Status].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'campaign_history.csv';
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
                            <p className="text-sm font-medium text-gray-600">Total Earned</p>
                            <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="gradient-bg-light p-3 rounded-lg">
                            <span className="text-white text-xl">💎</span>
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
                            <option value="date-desc">Date (Newest First)</option>
                            <option value="date-asc">Date (Oldest First)</option>
                            <option value="brand-asc">Brand (A-Z)</option>
                            <option value="brand-desc">Brand (Z-A)</option>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCampaigns.map((campaign) => (
                                <tr key={campaign.Campaign_ID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.Date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="gradient-bg p-2 rounded-lg mr-3">
                                                <span className="text-white text-xs font-bold">{campaign.Brand_Name[0]}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{campaign.Brand_Name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ${campaign.Revenue.toLocaleString()}
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
    const upcomingCampaigns = campaigns.filter(c => c.Status === 'Upcoming');
    const totalRevenue = completedCampaigns.reduce((sum, c) => sum + c.Revenue, 0);
    const avgRevenue = completedCampaigns.length > 0 ? totalRevenue / completedCampaigns.length : 0;

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
                        <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Earned</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="gradient-bg p-3 rounded-lg inline-block mb-3">
                            <span className="text-white text-xl">📊</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">${Math.round(avgRevenue).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Avg per Campaign</p>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={user.name} 
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={user.email} 
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                        <input 
                            type="text" 
                            value={new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                        <div>
                            <h3 className="font-medium text-blue-900">Account Management</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                To update your account information or change your password, please contact your agency administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                
                <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign) => (
                        <div key={campaign.Campaign_ID} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className={`p-2 rounded-lg ${
                                campaign.Status === 'Completed' ? 'bg-green-100' : 'gradient-bg'
                            }`}>
                                <span className={`text-xl ${
                                    campaign.Status === 'Completed' ? 'text-green-600' : 'text-white'
                                }`}>
                                    {campaign.Status === 'Completed' ? '✅' : '📅'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{campaign.Brand_Name} Campaign</h3>
                                <p className="text-sm text-gray-600">{campaign.Date} • ${campaign.Revenue.toLocaleString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                campaign.Status === 'Completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {campaign.Status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Login Component (Mock)
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </a>
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
                        Demo Mode: Use any email and password to login
                    </p>
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navigation user={mockUser} onLogout={handleLogout} />
                
                <div className="flex">
                    <div className="w-64 h-screen overflow-y-auto hidden md:block">
                        <Sidebar />
                    </div>
                    
                    <main className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-6xl mx-auto">
                            <Routes>
                                <Route path="/" element={<Dashboard campaigns={mockCampaigns} />} />
                                <Route path="/history" element={<History campaigns={mockCampaigns} />} />
                                <Route path="/profile" element={<Profile user={mockUser} campaigns={mockCampaigns} />} />
                            </Routes>
                        </div>
                    </main>
                </div>
                
                {/* Mobile Navigation - Hidden for now, can be implemented later */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                    <div className="flex justify-around">
                        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                            <span className="text-xl">📅</span>
                            <span className="text-xs">Dashboard</span>
                        </Link>
                        <Link to="/history" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                            <span className="text-xl">📋</span>
                            <span className="text-xs">History</span>
                        </Link>
                        <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                            <span className="text-xl">👤</span>
                            <span className="text-xs">Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Router>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root')); 
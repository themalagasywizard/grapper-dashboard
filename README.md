# Grapper - Influencer Dashboard Frontend

A sleek, modern web application for influencers to view their brand campaign collaborations and earnings.

## Features

### 🎯 **Dashboard**
- Interactive calendar view showing upcoming campaigns
- Campaign statistics and revenue tracking
- Quick overview of next 3 upcoming campaigns
- Real-time data visualization

### 📊 **History Page**
- Complete list of all campaigns (completed and upcoming)
- Advanced filtering and sorting options
- Pagination for large datasets
- CSV export functionality

### 👤 **Profile Page**
- User account information
- Campaign statistics and performance metrics
- Recent activity overview

### 🔐 **Authentication**
- Secure login system (currently mock - ready for Firebase integration)
- Session management
- Password reset functionality (ready for implementation)

## How to Run

1. **Open the application**: Simply open `index.html` in any modern web browser
2. **Login**: Use any email and password (demo mode)
3. **Navigate**: Use the sidebar or mobile navigation to switch between pages

## Technology Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS for responsive design
- **Calendar**: FullCalendar for interactive calendar view
- **Icons**: Lucide icons for modern UI elements
- **Routing**: React Router for single-page application navigation

## Mock Data Structure

The application uses mock data that matches your Google Sheets structure:

```javascript
{
    Campaign_ID: '001',
    Influencer_Email: 'sarah@example.com', 
    Date: '2025-01-15',
    Brand_Name: 'Nike',
    Revenue: 5000,
    Status: 'Upcoming' // or 'Completed'
}
```

## Pages Overview

### Dashboard
- **Stats Cards**: Upcoming campaigns, expected revenue, next campaign
- **Interactive Calendar**: Click events to see campaign details
- **Quick View**: Preview of next 3 campaigns

### History 
- **Filtering**: All, Completed, Upcoming campaigns
- **Sorting**: By date, brand name, or revenue (ascending/descending)
- **Export**: Download campaign history as CSV
- **Pagination**: Handles large datasets efficiently

### Profile
- **Account Info**: User details and membership information
- **Statistics**: Total campaigns, earnings, averages
- **Recent Activity**: Latest campaign interactions

## Design Features

- **Mobile-First**: Responsive design that works on all devices
- **Modern UI**: Clean, professional interface with gradient accents
- **Accessibility**: WCAG 2.1 compliant design patterns
- **Performance**: Optimized for fast loading and smooth interactions

## Next Steps for Integration

1. **Google Sheets API**: Replace mock data with real Google Sheets integration
2. **Firebase Auth**: Implement real authentication system
3. **Backend API**: Add serverless functions for data processing
4. **Email Notifications**: Implement campaign reminders
5. **Real-time Updates**: Add live data synchronization

## File Structure

```
Grapper Project/
├── index.html          # Main HTML file with CDN imports
├── app.js              # Complete React application
├── README.md           # This documentation
└── Grapper_PRD.markdown # Product Requirements Document
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)

## Demo Credentials

Since this is a demo version, you can login with any email and password combination. The app will automatically show Sarah Johnson's dashboard with sample campaign data.

---

**Ready for production deployment and Google Sheets integration!** 
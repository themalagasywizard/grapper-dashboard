# Product Requirements Document (PRD) for Grapper

## 1. Overview
### 1.1 Product Name
Grapper

### 1.2 Purpose
Grapper is a web application designed for a digital influencer agency to provide influencers with a secure, user-friendly portal to view their upcoming brand campaign collaborations and historical completed collaborations. The app uses the agency's Google Sheet as the data source, containing campaign details such as dates, brand names, and revenue.

### 1.3 Target Audience
- **Primary Users**: Influencers contracted by the agency.
- **Secondary Users**: Agency administrators (for data management via Google Sheet).

## 2. Features and Functionality

### 2.1 User Authentication
- **Login System**:
  - Influencers must log in to access the portal using unique credentials (email and password).
  - Authentication will be handled via a secure service (e.g., Firebase Authentication).
  - Password reset functionality for forgotten passwords.
- **Access Control**:
  - Each influencer can only view campaigns assigned to them.
  - No influencer can access another influencer’s data.

### 2.2 Dashboard
- **Calendar View**:
  - Displays upcoming brand collaborations in a monthly calendar format.
  - Each event shows the campaign date, brand name, and a brief description (if available).
  - Interactive calendar allowing navigation between months.
  - Clicking an event shows additional details (e.g., revenue, if permitted by the agency).
- **Responsive Design**:
  - Calendar adapts to desktop and mobile views.

### 2.3 History Page
- **Completed Collaborations List**:
  - A dedicated “History” button navigates to a page listing all past collaborations for the logged-in influencer.
  - List includes columns for date, brand name, revenue (if permitted), and status (e.g., “Completed”).
  - Sorting and filtering options (e.g., by date or brand name).
  - Pagination for large datasets.
- **Export Option**:
  - Influencers can download their collaboration history as a CSV file.

### 2.4 Data Integration
- **Google Sheet as Database**:
  - The app pulls data from the agency’s Google Sheet, which contains:
    - Campaign ID (unique identifier).
    - Influencer Email (to map campaigns to users).
    - Campaign Date.
    - Brand Name.
    - Revenue.
    - Status (e.g., “Upcoming” or “Completed”).
  - Real-time or near-real-time sync with Google Sheet using Google Sheets API.
  - Data validation to ensure consistency (e.g., valid dates, non-empty brand names).
- **Data Security**:
  - API keys and credentials stored securely (e.g., environment variables).
  - Read-only access to the Google Sheet for the app.

### 2.5 User Interface
- **Design Principles**:
  - Clean, modern, and intuitive UI.
  - Consistent branding (agency logo, colors, if provided).
  - Mobile-first responsive design.
- **Key Pages**:
  - Login page.
  - Dashboard with calendar.
  - History page with collaboration list.
  - Profile page (basic user info, e.g., name, email, logout button).

### 2.6 Notifications
- **Email Reminders**:
  - Optional: Send email reminders to influencers for upcoming campaigns (e.g., 3 days before).
  - Configurable by the agency via Google Sheet or admin settings.

## 3. Technical Requirements

### 3.1 Frontend
- Framework: React with JSX for a single-page application.
- Styling: Tailwind CSS for responsive and modern design.
- Calendar Library: FullCalendar or similar for interactive calendar.
- Hosted via CDN (e.g., cdn.jsdelivr.net for React and dependencies).

### 3.2 Backend
- Serverless Architecture: Firebase or Node.js with Express for API endpoints.
- Google Sheets API: For reading campaign data.
- Authentication: Firebase Authentication for secure login.
- Deployment: Vercel or Netlify for hosting.

### 3.3 Data Structure
- Google Sheet Columns (minimum):
  - `Campaign_ID`: Unique identifier (e.g., UUID or incremental ID).
  - `Influencer_Email`: Email of the assigned influencer.
  - `Date`: Campaign date (format: YYYY-MM-DD).
  - `Brand_Name`: Name of the brand.
  - `Revenue`: Campaign revenue (numeric, optional for display).
  - `Status`: “Upcoming” or “Completed”.
- Example Row:
  ```
  Campaign_ID: 001, Influencer_Email: influencer1@example.com, Date: 2025-08-15, Brand_Name: BrandX, Revenue: 5000, Status: Upcoming
  ```

### 3.4 Security
- HTTPS for all communications.
- Secure storage of API keys and credentials.
- Role-based access to ensure influencers only see their own data.
- Input sanitization to prevent injection attacks.

### 3.5 Performance
- Load time: < 3 seconds for dashboard and history pages.
- Calendar rendering: < 1 second for monthly view.
- Data sync: Near-real-time (e.g., every 5 minutes) or on-demand refresh.

## 4. Non-Functional Requirements
- **Scalability**: Support up to 100 influencers and 1,000 campaigns initially.
- **Reliability**: 99.9% uptime for the web app.
- **Accessibility**: WCAG 2.1 compliance (Level AA) for inclusivity.
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge (latest versions).

## 5. Assumptions
- The agency provides a Google Sheet with the required data structure.
- Influencers have valid email addresses for login.
- The agency handles user onboarding (e.g., providing login credentials).
- Revenue data display is permitted unless otherwise specified by the agency.
- No admin portal is required; the agency manages data via Google Sheet.

## 6. Constraints
- **Budget**: To be determined by the agency.
- **Timeline**: Development and testing within 6-8 weeks (TBD).
- **Dependencies**:
  - Google Sheets API access and credentials.
  - Agency’s Google Sheet must be accessible and properly formatted.
- **Limitations**:
  - No write access to Google Sheet from the app.
  - No complex admin features (e.g., campaign management within the app).

## 7. Success Metrics
- **User Adoption**: 80% of influencers log in within the first month.
- **Engagement**: 70% of influencers view the calendar or history page weekly.
- **Performance**: Average page load time < 3 seconds.
- **Error Rate**: < 1% of API calls fail due to app issues.
- **User Satisfaction**: Average rating of 4/5 in post-launch feedback survey.

## 8. Future Enhancements
- Admin portal for campaign management.
- Push notifications for upcoming campaigns.
- Analytics dashboard for influencers (e.g., total revenue earned).
- Integration with payment systems for revenue tracking.

## 9. Deliverables
- Fully functional web app hosted on a live URL.
- Documentation for setup and maintenance.
- Training guide for agency staff to manage Google Sheet data.
- Source code and deployment scripts.

## 10. Risks and Mitigation
- **Risk**: Google Sheet data inconsistencies.
  - **Mitigation**: Implement data validation and error handling.
- **Risk**: API rate limits for Google Sheets.
  - **Mitigation**: Cache data and optimize API calls.
- **Risk**: Security breaches.
  - **Mitigation**: Use secure authentication and encryption.
- **Risk**: Slow adoption by influencers.
  - **Mitigation**: Provide onboarding tutorials and support.

## 11. Stakeholders
- **Client**: Digital influencer agency owner.
- **Users**: Influencers.
- **Development Team**: Frontend and backend developers, UI/UX designer.
- **Project Manager**: Oversees timeline and deliverables.

## 12. Approval
- **Client Sign-Off**: Required before development begins.
- **Review Milestones**:
  - Wireframes and design mockups.
  - Beta version for testing.
  - Final deployment.

---

**Document Version**: 1.0  
**Created On**: August 01, 2025  
**Author**: Grok 3 (xAI)
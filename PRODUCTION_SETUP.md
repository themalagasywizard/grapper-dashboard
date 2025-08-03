# 🚀 Grapper Production Setup Guide
## Google Sheets API Integration for Real-Time Data

This guide will help you set up your Grapper dashboard to fetch data directly from Google Sheets in real-time, allowing your client to update their spreadsheet and see changes instantly on the website.

---

## 📋 Prerequisites

1. **Google Account** with access to Google Cloud Console
2. **Google Sheets** with your campaign data
3. **Domain** where you'll host the website
4. **Basic understanding** of Google Cloud services

---

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"** or select an existing project
3. Name your project (e.g., "Grapper Dashboard")
4. Click **"Create"**

### 1.2 Enable Google Sheets API

1. In the Google Cloud Console, navigate to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### 1.3 Create API Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"API Key"**
3. Copy the generated API key - you'll need this later
4. Click **"Restrict Key"** for security
5. Under **"API restrictions"**, select **"Restrict key"**
6. Choose **"Google Sheets API"** from the list
7. Under **"Website restrictions"**, add your domain(s):
   - `https://yourdomain.com/*`
   - `https://yourname.github.io/*` (if using GitHub Pages)
8. Click **"Save"**

---

## 📊 Step 2: Google Sheets Setup

### 2.1 Prepare Your Spreadsheet

1. Open your **Google Sheets** file
2. Ensure your data is in the **first sheet** (or note the sheet name)
3. Verify column headers match your current structure:
   - `Talent`
   - `Date Création`
   - `Marque`
   - `Date Fin`
   - `Status`
   - `Rémunération totale`
   - `Mail`
   - etc.

### 2.2 Get Spreadsheet ID

1. Open your Google Sheets file
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the **SPREADSHEET_ID** part (long string of letters and numbers)

### 2.3 Set Sharing Permissions

1. Click **"Share"** button in your Google Sheet
2. Set permissions to **"Anyone with the link can view"**
3. Or add your website domain as a viewer
4. Click **"Done"**

---

## ⚙️ Step 3: Configure the Application

### 3.1 Update API Configuration

Open `app-production.js` and find this section:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // Replace with your spreadsheet ID
    RANGE: 'Global1!A:AC', // Adjust range as needed
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
};
```

Replace:
- `YOUR_GOOGLE_API_KEY` with your actual API key
- `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID
- Adjust `RANGE` if your sheet name is different (e.g., `Sheet1!A:AC`)

### 3.2 Example Configuration

```javascript
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    SPREADSHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    RANGE: 'Global1!A:AC',
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
};
```

---

## 🌐 Step 4: Deploy to Production

### Option 1: GitHub Pages (Recommended)

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Configure Google Sheets API for production"
   git push
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "master" branch
   - Save

3. **Your site will be live at**: `https://yourusername.github.io/grapper-dashboard/`

### Option 2: Netlify

1. Connect your GitHub repository to Netlify
2. Deploy settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/` (root)
3. Deploy

### Option 3: Vercel

1. Connect your GitHub repository to Vercel
2. Deploy with default settings

---

## 🔒 Step 5: Security Best Practices

### 5.1 API Key Security

- ✅ **DO**: Restrict your API key to specific domains
- ✅ **DO**: Restrict to only Google Sheets API
- ❌ **DON'T**: Commit API keys to public repositories
- ❌ **DON'T**: Use unrestricted API keys

### 5.2 Spreadsheet Security

- ✅ **DO**: Use "Anyone with link can view" for simplicity
- ✅ **DO**: Regularly review who has access
- ❌ **DON'T**: Make sheets publicly discoverable
- ❌ **DON'T**: Include sensitive data in viewable columns

---

## ✨ Step 6: Features Available

### 🔄 Real-Time Updates
- Data refreshes automatically every 30 seconds
- Manual refresh button in the header
- Updates appear instantly when sheet is modified

### 📱 Production Features
- **Live Data**: Fetches directly from Google Sheets
- **Caching**: Smart caching to avoid API limits
- **Error Handling**: Graceful error handling with retry options
- **Loading States**: Professional loading indicators
- **Last Updated**: Shows when data was last fetched

### 🌍 User Experience
- **Instant Login**: Email validation against live sheet data
- **Personalized**: Each user sees only their campaigns
- **Bilingual**: English/French toggle
- **Responsive**: Works on all devices

---

## 🔧 Step 7: Testing

### 7.1 Test Data Flow

1. **Open your Google Sheet**
2. **Modify a campaign** (change date, add new row, etc.)
3. **Refresh the website** or wait 30 seconds
4. **Verify changes appear** in the dashboard

### 7.2 Test User Login

1. **Check "Available Users" tab** for valid emails
2. **Login with different user emails**
3. **Verify each user sees only their campaigns**

---

## 🚨 Troubleshooting

### Common Issues

**"Configuration Error"**
- Check API key is correctly set
- Verify spreadsheet ID is correct
- Ensure Google Sheets API is enabled

**"No Data Found"**
- Check sheet sharing permissions
- Verify sheet name in RANGE setting
- Ensure data starts from row 1 with headers

**"API Quota Exceeded"**
- Wait a few minutes for quota to reset
- Implement longer cache times if needed
- Check for unnecessary API calls

### Debug Mode

Open browser console (F12) to see detailed error messages and API responses.

---

## 📈 Step 8: Client Instructions

### For Your Client (Sheet Owner)

**To Update Campaign Data:**

1. **Open your Google Sheet**
2. **Modify any campaign information**:
   - Add new campaigns
   - Update dates, brands, revenue
   - Change status (Fait/En cours)
   - Add/modify influencer emails
3. **Save the sheet** (auto-saves)
4. **Changes appear on website** within 30 seconds

**Important Notes for Client:**
- ✅ Keep column headers unchanged
- ✅ Use consistent date format (DD/MM/YYYY)
- ✅ Ensure email addresses are correct
- ✅ Use "Fait" for completed campaigns
- ❌ Don't delete or rename the sheet
- ❌ Don't change column order

---

## 🎯 Production Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] API key created and restricted
- [ ] Spreadsheet ID obtained
- [ ] Sharing permissions set
- [ ] `app-production.js` configured
- [ ] Code deployed to production
- [ ] Domain restrictions updated
- [ ] Real-time updates tested
- [ ] User login tested
- [ ] Client instructed on sheet management

---

## 📞 Support

If you encounter any issues:

1. **Check browser console** for error messages
2. **Verify API key restrictions** match your domain
3. **Test sheet access** manually in browser
4. **Review sharing permissions** on the spreadsheet

---

**Your Grapper dashboard is now ready for production with real-time Google Sheets integration! 🚀** 
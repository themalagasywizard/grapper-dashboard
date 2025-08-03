# 🔒 Secure Deployment Guide
## Environment Variables & Serverless Security

This guide shows how to securely deploy your Grapper dashboard using Netlify environment variables and serverless functions, protecting your API keys from client-side exposure.

---

## 🚨 **Security Implementation**

### **What We Fixed:**
- ❌ **Before**: API keys hardcoded in client-side JavaScript (visible to everyone)
- ✅ **After**: API keys stored as secure environment variables on the server

### **Benefits:**
- 🔒 **API keys are secure** and not visible in browser source code
- 🛡️ **Safe to transfer** to your client without exposing credentials
- 🔄 **Easy to rotate** keys without code changes
- 📊 **Better logging** and error handling

---

## ⚙️ **Step 1: Set Up Netlify Environment Variables**

### **1.1 Access Netlify Dashboard**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your **"Grapper Dashboard"** site
3. Go to **Site settings** → **Environment variables**

### **1.2 Add Required Variables**
Click **"Add a variable"** and add these three variables:

| Variable Name | Value | Example |
|---|---|---|
| `GOOGLE_SHEETS_API_KEY` | Your Google API key | `AIzaSy...` (39 characters) |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Your sheet ID | `1SfNNCc4X71...` (44 characters) |
| `GOOGLE_SHEETS_RANGE` | Sheet range (optional) | `Global1!A1:AC2000` |

### **1.3 Save & Deploy**
1. Click **"Save"** after adding each variable
2. Go to **Deploys** tab
3. Click **"Trigger deploy"** → **"Deploy site"**

---

## 🔧 **Step 2: Verify Serverless Function**

### **2.1 Test the Function**
After deployment, test the serverless function:
- Visit: `https://your-site-name.netlify.app/.netlify/functions/google-sheets`
- Should return JSON with your Google Sheets data

### **2.2 Check Function Logs**
1. In Netlify Dashboard → **Functions** tab
2. Click on `google-sheets` function
3. View logs to debug any issues

---

## 🌐 **Step 3: Transfer to Client**

### **3.1 Prepare for Transfer**
1. **Document the environment variables** your client will need
2. **Share this guide** with setup instructions
3. **Test thoroughly** before transfer

### **3.2 Transfer Process**
1. **Transfer Netlify site ownership**:
   - Netlify Dashboard → Site settings → General → Transfer site
   - Enter client's email address
2. **Share environment variable values** securely
3. **Provide this documentation**

### **3.3 Client Setup Instructions**
Your client will need to:
1. Accept the Netlify site transfer
2. Set up the environment variables (using values you provide)
3. Redeploy the site

---

## 🛡️ **Security Best Practices**

### **✅ DO:**
- Use environment variables for all API keys
- Regularly rotate API keys
- Restrict API keys to specific domains
- Monitor function usage and logs
- Use HTTPS only

### **❌ DON'T:**
- Hardcode API keys in client-side code
- Commit environment files to git
- Share API keys via insecure channels
- Use unrestricted API keys

---

## 🔍 **Environment Variables Reference**

### **Required Variables:**

#### `GOOGLE_SHEETS_API_KEY`
- **Purpose**: Authenticates with Google Sheets API
- **Source**: Google Cloud Console → APIs & Services → Credentials
- **Format**: `AIzaSy...` (39 characters)

#### `GOOGLE_SHEETS_SPREADSHEET_ID`
- **Purpose**: Identifies which Google Sheet to read
- **Source**: From your Google Sheets URL
- **Format**: `1SfNNCc4X71...` (44 characters alphanumeric)

#### `GOOGLE_SHEETS_RANGE` (Optional)
- **Purpose**: Specifies which cells to read
- **Default**: `Global1!A1:AC2000`
- **Format**: `SheetName!StartCell:EndCell`

---

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **"Missing environment variables" error**
- Verify all required variables are set in Netlify
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

#### **"Function not found" error**
- Ensure `netlify/functions/google-sheets.js` exists
- Check file is committed to repository
- Verify Netlify build completed successfully

#### **"Google Sheets API error"**
- Verify API key is correct and active
- Check spreadsheet ID is accurate
- Ensure sheet sharing is set to "Anyone with link can view"

#### **CORS errors**
- Serverless function includes CORS headers
- If issues persist, check browser developer tools

---

## 📋 **Deployment Checklist**

Before transferring to client:

- [ ] Environment variables set in Netlify
- [ ] Serverless function working correctly
- [ ] API keys removed from client-side code
- [ ] Site deployed and tested
- [ ] All features working (login, calendar, invoices)
- [ ] Error handling tested
- [ ] Client documentation prepared

---

## 📞 **Client Support**

### **For Your Client:**

**If you encounter issues after transfer:**

1. **Check environment variables** are set correctly
2. **View function logs** in Netlify Dashboard → Functions
3. **Test the API endpoint** directly: `/.netlify/functions/google-sheets`
4. **Verify Google Sheets sharing** permissions
5. **Contact original developer** with specific error messages

---

## 🔄 **Updating API Keys**

### **When you need to rotate keys:**

1. **Generate new API key** in Google Cloud Console
2. **Update environment variable** in Netlify
3. **Trigger redeploy**
4. **Test functionality**
5. **Delete old API key** from Google Cloud Console

**No code changes required!** 🎉

---

**Your Grapper dashboard is now secure and ready for client transfer! 🚀** 
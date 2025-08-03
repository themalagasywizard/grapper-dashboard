# 🔧 API Key Referrer Fix Guide

## 🚨 **Current Issue:**
Your Google API key has HTTP referrer restrictions that block serverless function requests.

**Error**: `API_KEY_HTTP_REFERRER_BLOCKED - Requests from referer <empty> are blocked`

---

## ✅ **Solution: Update API Key Restrictions**

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your API key (starts with `AIzaSy...`)
4. Click the **Edit** (pencil) icon

### **Step 2: Update Application Restrictions**

#### **Option A: Allow Both Browser & Server (Recommended)**
1. Change **Application restrictions** from "HTTP referrers" to **"None"**
2. This allows both browser and server-side usage
3. Click **Save**

#### **Option B: Add Netlify Domain to Referrers (Alternative)**
1. Keep **"HTTP referrers (web sites)"** selected
2. Add these referrers:
   ```
   https://peppy-stroopwafel-67cade.netlify.app/*
   https://*.netlify.app/*
   https://localhost:*/*
   ```
3. Click **Save**

### **Step 3: Test the Fix**
1. Wait 2-3 minutes for changes to propagate
2. Refresh your Grapper dashboard
3. Check if data loads successfully

---

## 🔄 **Alternative: Create New Unrestricted API Key**

If you prefer to keep the current key restricted:

1. **Create New API Key**:
   - Google Cloud Console → APIs & Services → Credentials
   - Click **"+ CREATE CREDENTIALS"** → **"API key"**
   - Set **Application restrictions** to **"None"**

2. **Update Environment Variable**:
   - Netlify Dashboard → Site settings → Environment variables
   - Update `GOOGLE_SHEETS_API_KEY` with the new key
   - Redeploy site

---

## 🎯 **Recommended Solution**

**Choose Option A (No restrictions)** because:
- ✅ Works with serverless functions
- ✅ Still secure (API key is hidden server-side)
- ✅ No domain management needed
- ✅ Works for local development too

---

## ⚠️ **Security Note**

Even with "No restrictions":
- 🔒 API key is stored securely as environment variable
- 🔒 Not visible in browser source code
- 🔒 Only accessible server-side via Netlify functions
- 🔒 Protected by Netlify's security measures

---

**After fixing, your dashboard will work perfectly! 🚀** 
# 🚀 Complete Deployment Guide: Transformer CAD & AI Engineering Portal

> **Repository**: [`https://github.com/shivam-smraj/Machine-Design-EE-5th-sem.git`](https://github.com/shivam-smraj/Machine-Design-EE-5th-sem.git)  
> **Framework**: Next.js 14+ (App Router)  
> **Platform**: Vercel (Recommended) / Netlify / Self-Hosted Node.js

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Vercel Deployment (Recommended - Step-by-Step)](#2-vercel-deployment-recommended---step-by-step)
3. [Setting Up Environment Variables](#3-setting-up-environment-variables)
4. [Continuous Integration (CI/CD) Workflow](#4-continuous-integration-cicd-workflow)
5. [Local Production Build & Testing](#5-local-production-build--testing)
6. [Troubleshooting & FAQs](#6-troubleshooting--faqs)

---

## 1. Prerequisites

Before starting deployment, ensure you have:

- A **GitHub Account** with access to your repository: `shivam-smraj/Machine-Design-EE-5th-sem`.
- A **Vercel Account** (Sign up for free at [vercel.com](https://vercel.com) using your GitHub account).
- A **Google Gemini API Key** for the TransformerGPT AI Assistant:
  - Generate a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 2. Vercel Deployment (Recommended - Step-by-Step)

Vercel is the native cloud platform for Next.js and provides zero-config deployments with free SSL certificates and global CDN edge hosting.

### Step 1: Log in to Vercel
1. Open [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Log in using your GitHub credentials.

### Step 2: Import Your GitHub Repository
1. Click the **"Add New..."** button at the top right of your Vercel Dashboard.
2. Select **"Project"** from the dropdown menu.
3. In the "Import Git Repository" list, search for `Machine-Design-EE-5th-sem`.
4. Click **"Import"** next to `shivam-smraj/Machine-Design-EE-5th-sem`.

---

### Step 3: Configure Project Settings

Vercel will automatically read the repository's [`package.json`](file:///c:/Users/Shivam/Desktop/Machine_Design/package.json) and [`vercel.json`](file:///c:/Users/Shivam/Desktop/Machine_Design/vercel.json).

Verify the pre-filled fields match:

| Setting | Value |
| :--- | :--- |
| **Project Name** | `machine-design-ee-5th-sem` |
| **Framework Preset** | **Next.js** *(Autodetected)* |
| **Root Directory** | `./` *(Default root directory)* |
| **Build Command** | `npm --prefix transformer-cad-portal run build` |
| **Output Directory** | `transformer-cad-portal/.next` |
| **Install Command** | `npm --prefix transformer-cad-portal install` |

---

### Step 4: Add Environment Variables

Expand the **"Environment Variables"** section:

1. **Key**: `GEMINI_API_KEY`
2. **Value**: `AIzaSy...` *(Paste your Google Gemini API Key here)*
3. Click **"Add"**.

---

### Step 5: Trigger Build & Deploy
1. Click the **"Deploy"** button.
2. Vercel will clone the repo, install dependencies, compile Next.js static pages, and generate your live deployment link in ~30–45 seconds!

🎉 **Your Live URL will look like**:  
`https://machine-design-ee-5th-sem.vercel.app`

---

## 3. Setting Up Environment Variables

If you need to add or update your Gemini API key after deployment:

1. Go to your **Vercel Dashboard**.
2. Click on your project: `machine-design-ee-5th-sem`.
3. Navigate to **Settings** $\rightarrow$ **Environment Variables**.
4. Add/edit `GEMINI_API_KEY`.
5. Click **Save**.
6. Go to **Deployments** tab $\rightarrow$ click the three dots `...` on the latest deployment $\rightarrow$ select **Redeploy**.

---

## 4. Continuous Integration (CI/CD) Workflow

Every time you push code updates to GitHub:

```bash
git add .
git commit -m "Add new transformer feature"
git push origin main
```

- Vercel automatically detects the push, builds a preview/production deployment, and updates your live site automatically!
- Instant rollback is available from the Vercel dashboard if needed.

---

## 5. Local Production Build & Testing

To test the production build locally on your machine before pushing to GitHub:

```bash
# 1. Navigate to root or portal directory
cd c:\Users\Shivam\Desktop\Machine_Design

# 2. Run production build command
npm --prefix transformer-cad-portal run build

# 3. Test production server locally
npm --prefix transformer-cad-portal run start
```

Open `http://localhost:3000` to preview the production site locally.

---

## 6. Troubleshooting & FAQs

### Q1: `Error: No Next.js version detected`
- **Solution**: Resolved by our updated [`package.json`](file:///c:/Users/Shivam/Desktop/Machine_Design/package.json) which includes `"next": "16.3.0"` in the root repository.

### Q2: `sh: line 1: cd: transformer-cad-portal: No such file or directory`
- **Solution**: Resolved by using `npm --prefix transformer-cad-portal` instead of directory change scripts in [`vercel.json`](file:///c:/Users/Shivam/Desktop/Machine_Design/vercel.json).

### Q3: AI Assistant returns `Gemini API Key is missing`
- **Solution**: Make sure you added `GEMINI_API_KEY` under **Vercel Settings $\rightarrow$ Environment Variables** and redeployed.

---

## 📜 Summary Command Reference

```bash
# Clone repository
git clone https://github.com/shivam-smraj/Machine-Design-EE-5th-sem.git

# Install dependencies
npm run postinstall

# Run local development server
npm run dev
```

# 🌿 iPanelKlean nA2 — MIS Dashboard

> Role-based MIS Dashboard for iPanelKlean's Waterless Solar Self-Cleaning System  
> Built with **Angular 21** + **Firebase** (Auth + Firestore)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [User & Role Management](#user--role-management)
- [Available Modules](#available-modules)
- [Role Access Guide](#role-access-guide)
- [How to Add New User](#how-to-add-new-user)
- [How to Run Locally](#how-to-run-locally)
- [Deployment](#deployment)

---

## 🚀 Project Overview

iPanelKlean nA2 MIS Dashboard is a **role-based access control (RBAC)** system where:

- Every user logs in via **Google OAuth** or **Email/Password**
- Firebase Firestore checks their **role** and **allowed modules**
- Each user sees **only their assigned modules** on the dashboard
- Admin (MD) can manage all users via Firebase Console

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Angular 21 | Frontend Framework |
| TypeScript | Language |
| SCSS | Styling |
| Firebase Auth | Google + Email/Password Login |
| Cloud Firestore | User roles & module access |
| Angular Fire | Firebase + Angular integration |

---

## 📁 Project Structure

```
ipanelklean-dashboard/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   ├── auth-guard.ts        ← Login check (redirect if not logged in)
│   │   │   └── admin-guard.ts       ← Admin only routes
│   │   ├── services/
│   │   │   ├── auth.ts              ← Google login, email login, logout
│   │   │   └── role.ts              ← Firestore user data fetch
│   │   ├── pages/
│   │   │   ├── login/               ← Login + Signup page
│   │   │   ├── dashboard/           ← Main role-based dashboard
│   │   │   └── admin/               ← Admin panel (MD only)
│   │   ├── app.config.ts            ← Firebase providers setup
│   │   ├── app.routes.ts            ← All routes defined here
│   │   └── app.ts                   ← Root component
│   ├── environments/
│   │   ├── environment.ts           ← Dev Firebase config
│   │   ├── environment.development.ts
│   │   └── environment.production.ts ← Prod Firebase config
│   └── assets/
│       └── logo.png                 ← iPanelKlean logo
├── angular.json
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v22.x (LTS) |
| Angular CLI | Latest |
| Git | Any |

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ipanelklean-dashboard.git
cd ipanelklean-dashboard

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Run locally
ng serve

# 4. Open browser
# http://localhost:4200
```

---

## 🔥 Firebase Setup

### Step 1 — Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name: `iPanelKlean`
3. Enable Google Analytics (optional)

### Step 2 — Enable Authentication
1. Left sidebar → **Authentication** → **Sign-in method**
2. Enable **Google** ✅
3. Enable **Email/Password** ✅
4. Save

### Step 3 — Create Firestore Database
1. Left sidebar → **Firestore Database**
2. Click **"Create database"**
3. Select **Standard edition**
4. Location: `asia-south1` (Mumbai)
5. Security: **Start in test mode**
6. Click **Create**

### Step 4 — Add Firebase Config to Project

Go to **Project Settings** → **Your apps** → `</>` Web app

Copy the config and paste in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### Step 5 — Firestore Security Rules (Production ke liye)

Firestore → **Rules** tab → Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.token.email == userId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'md';
    }
  }
}
```

---

## 👥 User & Role Management

### Firestore `users` Collection Structure

Each document in the `users` collection represents one user:

```
Collection: users
  └── Document ID: user@gmail.com   ← Email is the document ID
        email:   "user@gmail.com"   (string)
        role:    "md"               (string)
        modules: ["MD Dashboard", "CRM", ...]  (array)
```

---

## 🎭 Role Access Guide

### Available Roles

| Role | Description | Who gets it |
|---|---|---|
| `md` | Full access — all 15 modules | Managing Director |
| `admin` | Full access — all 15 modules | System Administrator |
| `pc` | PC Dashboard, MIS Scores | PC Team |
| `ea` | EA Dashboard, Task List | Executive Assistant |
| `crm` | CRM, Lead Referral | Sales / CRM Team |
| `accounts` | Accounts Dashboard, Tax Invoice, Purchase FMS | Accounts Team |
| `fms` | FMS List, Remote Working FMS, Purchase FMS | Field Management |
| `hr` | Delegation Sheet, Checklist System, Task List | HR Team |
| `operations` | Checklist System, FMS List, MIS Scores | Operations Team |

---

### Role → Module Mapping (Recommended)

#### 👑 MD / Admin — All Modules
```
MD Dashboard, System Master, Delegation Sheet, Checklist System,
Task List, Lead Referral, FMS List, Purchase FMS,
Remote Working FMS, MIS Scores, Accounts Dashboard, CRM,
PC Dashboard, EA Dashboard, Tax Invoice FMS
```

#### 💼 CRM Team
```
CRM, Lead Referral
```

#### 💰 Accounts Team
```
Accounts Dashboard, Tax Invoice FMS, Purchase FMS, MIS Scores
```

#### 🗺️ FMS / Field Team
```
FMS List, Remote Working FMS, Purchase FMS, Checklist System
```

#### 🧑‍💻 PC Team
```
PC Dashboard, MIS Scores, Task List
```

#### 📋 EA / Executive Assistant
```
EA Dashboard, Task List, Delegation Sheet, MIS Scores
```

#### 👔 HR Team
```
Delegation Sheet, Checklist System, Task List
```

#### ⚙️ Operations
```
Checklist System, FMS List, MIS Scores, Remote Working FMS
```

---

## ➕ How to Add New User

### Method 1 — Firebase Console (Manual)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select project → **Firestore Database**
3. Open `users` collection
4. Click **"+ Add document"**
5. **Document ID** = user's email (e.g. `rohit@gmail.com`)
6. Add fields:

```
Field: email    Type: string   Value: rohit@gmail.com
Field: role     Type: string   Value: crm
Field: modules  Type: array
  → CRM
  → Lead Referral
```

7. Click **Save**
8. User can now login at your dashboard URL

### Method 2 — User Signup + Admin assigns modules

1. User visits the dashboard and clicks **"Signup"**
2. Creates account with email + password
3. **Admin (MD)** goes to Firestore Console
4. Finds the new user's email in `users` collection (or creates document)
5. Assigns `role` and `modules` array
6. User can now login and see their modules

---

## 📦 Available Modules

### Row 1 — Management

| Module Name | Category | Description |
|---|---|---|
| MD Dashboard | Management | Full MIS overview for MD |
| System Master | Admin | System configuration |
| Delegation Sheet | HR & Teams | Task delegation tracker |
| Checklist System | Operations | Daily checklists |
| Task List | Productivity | Team task management |
| Lead Referral | Sales | Lead tracking & referrals |

### Row 2 — Field & Operations

| Module Name | Category | Description |
|---|---|---|
| FMS List | Field Mgmt | Field management system list |
| Purchase FMS | Procurement | Purchase orders & tracking |
| Remote Working FMS | Remote Ops | Remote team management |
| MIS Scores | Analytics | Performance scores |
| Accounts Dashboard | Finance | Financial overview |
| CRM | Customers | Customer relationship mgmt |

### Row 3 — Finance & Analytics

| Module Name | Category | Description |
|---|---|---|
| PC Dashboard | Operations | PC team dashboard |
| EA Dashboard | Executive | Executive assistant view |
| Tax Invoice FMS | Finance | Tax invoice management |

---

## 🔐 Authentication Flow

```
User visits app
      ↓
Login Page (Google / Email+Password)
      ↓
Firebase Auth verifies credentials
      ↓
Firestore checks users/{email} document
      ↓
  ┌── Found? ──────────────────────────┐
  │                                    │
  ↓ YES                                ↓ NO
Role + modules saved               "Access Denied"
to localStorage                    Logout → Login page
      ↓
Dashboard shows only
allowed modules
```

---

## 🚀 How to Run Locally

```bash
# Clone karo
git clone https://github.com/YOUR_USERNAME/ipanelklean-dashboard.git
cd ipanelklean-dashboard

# Dependencies install karo
npm install --legacy-peer-deps

# Development server start karo
ng serve

# Browser mein kholo
# http://localhost:4200
```

---

## 🌐 Deployment

### Firebase Hosting pe Deploy karo (Free)

```bash
# Step 1: Firebase CLI install karo
npm install -g firebase-tools

# Step 2: Login karo
firebase login

# Step 3: Initialize karo (ek baar)
firebase init hosting
# Select: Use existing project → iPanelKlean
# Public directory: dist/ipanelklean-dashboard/browser
# Single page app: YES
# Overwrite index.html: NO

# Step 4: Build karo
ng build

# Step 5: Deploy karo
firebase deploy

# Your live URL milegi:
# https://ipanelklean-68c24.web.app
```

---

## 🔧 Common Issues & Fixes

| Error | Fix |
|---|---|
| `ERESOLVE` npm error | Use `npm install --legacy-peer-deps` |
| Logo not showing | Put `logo.png` in `src/assets/` folder |
| `Access denied` on login | Add user document in Firestore `users` collection |
| `Please wait...` stuck | Check Firestore rules — allow read for auth users |
| Google login popup blocked | Allow popups in browser for localhost |
| Module not visible | Check spelling in Firestore `modules` array — must match exactly |

---

## 📞 Support

For issues or access requests, contact the **MD / System Admin**.

> **Note:** Module names in Firestore must match **exactly** (case-sensitive):  
> ✅ `MD Dashboard`  
> ❌ `md dashboard` or `MD dashboard`

---

## 📄 License

Copyright © iPanelKlean 2022. All Rights Reserved.  
Powered by **nA2 Technology**

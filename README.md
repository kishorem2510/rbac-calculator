# RBAC Calculator

A serverless Role Based Access Control Calculator built with Next.js and AWS.

🔗 **Live App:** https://rbac-calculator.vercel.app
📦 **GitHub:** https://github.com/kishorem2510/rbac-calculator.git

---

## What is this app?

A calculator where your role decides what operations you can perform.

| Role | Allowed Operations |
|---|---|
| 👑 Admin | Add, Subtract, Multiply, Divide |
| 👤 Member | Add, Subtract, Multiply |
| 👁️ Viewer | Add only |

If you try a blocked operation — Lambda returns **Access Denied!**

---

## How it works

```
User registers and selects a role
        ↓
Cognito creates account and sends verification email
        ↓
User verifies email and logs in
        ↓
Cognito returns JWT token
        ↓
Calculator opens — Lambda fetches allowed operations
        ↓
Allowed buttons → ACTIVE
Blocked buttons → GREYED OUT
        ↓
User performs calculation
        ↓
Lambda checks role permission in DynamoDB
        ↓
Allowed → calculates and saves to history
Blocked → returns Access Denied ❌
        ↓
Admin can manage users, roles and view history
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend UI |
| AWS Lambda | Backend logic |
| AWS Cognito | User authentication |
| AWS DynamoDB | Data storage |
| AWS API Gateway | Lambda HTTP endpoints |
| AWS IAM | Access control |
| Tailwind CSS | Styling |

---

## AWS Resources

### DynamoDB Tables (4)

| Table | Purpose |
|---|---|
| RBAC-Calculator | AWS service permissions per role |
| RBAC-Roles | Calculator operations per role |
| RBAC-Users | Registered user details |
| RBAC-History | All calculation records |

### Lambda Functions (4)

| Function | Purpose |
|---|---|
| rbac-calculator-check | Checks AWS service permissions |
| rbac-auth-handler | Register, verify, login |
| rbac-calculator-handler | Performs calculations + saves history |
| rbac-admin-handler | Manages users, roles, history |

### Cognito
```
User Pool ID:  ap-south-1_OAW95gop6
Region:        ap-south-1 (Mumbai)
```

---

## Project Structure

```
rbac-calculator/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx       → Login page
│   │   ├── register/page.tsx    → Register page
│   │   └── verify/page.tsx      → Email verification page
│   ├── calculator/page.tsx      → Main calculator page
│   ├── admin/page.tsx           → Admin dashboard
│   ├── api/roles/route.ts       → Next.js API route
│   ├── page.tsx                 → Landing page
│   └── layout.tsx               → App layout
├── lib/
│   ├── auth.ts                  → Amplify config
│   └── dynamodb.ts              → DynamoDB connection
├── .env.local                   → Environment variables
└── README.md
```

---

## Local Setup

### Step 1 — Clone the repo
```bash
git clone https://github.com/kishorem2510/rbac-calculator.git
cd rbac-calculator
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Install AWS packages
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
npm install aws-amplify @aws-amplify/auth amazon-cognito-identity-js
```

### Step 4 — Create `.env.local` file
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=RBAC-Calculator

COGNITO_USER_POOL_ID=ap-south-1_OAW95gop6
COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_USER_POOL_ID=ap-south-1_OAW95gop6
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id

NEXT_PUBLIC_AUTH_API_URL=https://4skysmjkrc.execute-api.ap-south-1.amazonaws.com/default/rbac-auth-handler
NEXT_PUBLIC_CALCULATOR_API_URL=https://4yj8paebd7.execute-api.ap-south-1.amazonaws.com/default/rbac-calculator-handler
NEXT_PUBLIC_ADMIN_API_URL=https://4mxqosww7e.execute-api.ap-south-1.amazonaws.com/default/rbac-admin-handler
LAMBDA_API_URL=https://mnnns78umh.execute-api.ap-south-1.amazonaws.com/default/rbac-calculator-check
```

### Step 5 — Run the app
```bash
npm run dev
```

### Step 6 — Open browser
```
http://localhost:3000
```

---

## How to Use

### As a Normal User:
```
1. Go to live app
2. Click Register
3. Enter email, password, select role
4. Check email for verification code
5. Enter code on verify page
6. Login with email and password
7. Use the calculator!
```

### As Admin:
```
1. Register with Admin role
2. Login
3. Click Admin button (top right)
4. Manage users, roles and history
```

---

## Pages

| Page | URL | What it does |
|---|---|---|
| Landing | / | Home page with login/register buttons |
| Register | /register | Create new account |
| Verify | /verify | Enter email verification code |
| Login | /login | Login with email and password |
| Calculator | /calculator | Main calculator with history |
| Admin | /admin | Admin dashboard |

---

## NPM Packages Installed

```bash
# Core Next.js (auto installed)
npm install next react react-dom

# AWS SDK for DynamoDB
npm install @aws-sdk/client-dynamodb
npm install @aws-sdk/lib-dynamodb

# AWS Amplify for Cognito auth
npm install aws-amplify
npm install @aws-amplify/auth
npm install amazon-cognito-identity-js

# Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# TypeScript types
npm install -D @types/node @types/react @types/react-dom typescript
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| AWS_ACCESS_KEY_ID | AWS account access key |
| AWS_SECRET_ACCESS_KEY | AWS account secret key |
| AWS_REGION | AWS region (ap-south-1) |
| DYNAMODB_TABLE_NAME | Main DynamoDB table |
| COGNITO_USER_POOL_ID | Cognito pool ID (server side) |
| COGNITO_CLIENT_ID | Cognito client ID (server side) |
| NEXT_PUBLIC_COGNITO_USER_POOL_ID | Cognito pool ID (client side) |
| NEXT_PUBLIC_COGNITO_CLIENT_ID | Cognito client ID (client side) |
| NEXT_PUBLIC_AUTH_API_URL | Auth Lambda API URL |
| NEXT_PUBLIC_CALCULATOR_API_URL | Calculator Lambda API URL |
| NEXT_PUBLIC_ADMIN_API_URL | Admin Lambda API URL |
| LAMBDA_API_URL | RBAC check Lambda API URL |

---

## Roles and Permissions

### Calculator Operations
| Role | Add | Subtract | Multiply | Divide |
|---|---|---|---|---|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Member | ✅ | ✅ | ✅ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ |

### AWS Service Permissions
| Role | S3 | DynamoDB | Lambda | CloudWatch | IAM |
|---|---|---|---|---|---|
| Admin | Full | Full | Full | Read | Read |
| Member | Read/Write | Read/Write | Invoke | None | None |
| Viewer | Read | Read | None | None | None |

---

## Deployment

App is deployed on **Vercel**

🔗 https://rbac-calculator.vercel.app

Auto deploys when you push to GitHub master branch.

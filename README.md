# RBAC Calculator

A Role Based Access Control (RBAC) Calculator built with Next.js, AWS IAM and DynamoDB.

Live App - https://rbac-calculator.vercel.app/

## What it does

Select a role (Admin, Member, Viewer) and instantly see what AWS permissions that role has.

## Tech Stack

- **Next.js** — Frontend UI
- **AWS IAM** — Role and permission management
- **AWS DynamoDB** — Stores role permission data
- **Tailwind CSS** — Styling

## How it works
```
User selects a role
        ↓
Frontend calls API route
        ↓
API route fetches from DynamoDB
        ↓
Permission matrix displayed
```

## Roles

| Role | Access |
|------|--------|
| Admin | Full access to S3, DynamoDB, Lambda, CloudWatch, IAM |
| Member | Limited access to S3, DynamoDB, Lambda |
| Viewer | Read only access to S3 and DynamoDB |

## Project Structure
```
rbac-calculator/
├── app/
│   ├── api/roles/route.ts   → API route (fetches from DynamoDB)
│   ├── page.tsx             → Main UI page
│   └── layout.tsx           → App layout
├── lib/
│   └── dynamodb.ts          → DynamoDB connection and queries
├── .env.local               → AWS credentials (not pushed to GitHub)
└── README.md
```

## Setup

1. Clone the repo:
```bash
git clone https://github.com/your-username/rbac-calculator.git
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=RBAC-Calculator
```

4. Run the app:
```bash
npm run dev
```

5. Open browser:
```
http://localhost:3000
```

## AWS Setup Required

- IAM Roles created: `RBAC-Admin-Role`, `RBAC-Member-Role`, `RBAC-Viewer-Role`
- DynamoDB Table: `RBAC-Calculator`
- Table Partition Key: `role_name` (String)

## Screenshots

> Select Admin role → see full permission matrix
> Select Member role → see limited permissions
> Select Viewer role → see read only permissions

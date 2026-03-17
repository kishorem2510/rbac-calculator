# RBAC Calculator

A Role Based Access Control Calculator built with Next.js, AWS Lambda, AWS IAM and DynamoDB.

## What it does

Select a role, choose what actions you want to perform on AWS services, click Calculate — AWS Lambda checks if that role is allowed or blocked for each action.

## How it works
```
User selects a Role (Admin / Member / Viewer)
        ↓
User selects Actions (S3 read, Lambda invoke etc.)
        ↓
User clicks CALCULATE
        ↓
Next.js sends request to API route
        ↓
API route calls AWS Lambda function
        ↓
Lambda checks permissions in DynamoDB
        ↓
Lambda returns ALLOWED or BLOCKED
        ↓
UI displays the result
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend UI |
| AWS Lambda | Backend calculator |
| AWS IAM | Role and permission management |
| AWS DynamoDB | Stores role permission data |
| AWS API Gateway | Exposes Lambda as HTTP endpoint |
| Tailwind CSS | Styling |

## Roles

| Role | Access |
|---|---|
| Admin | Full access — S3, DynamoDB, Lambda, CloudWatch, IAM |
| Member | Limited access — S3, DynamoDB, Lambda only |
| Viewer | Read only — S3 and DynamoDB read only |

## Project Structure
```
rbac-calculator/
├── app/
│   ├── api/
│   │   └── roles/
│   │       └── route.ts
│   ├── page.tsx
│   └── layout.tsx
├── lib/
│   └── dynamodb.ts
├── .env.local
└── README.md
```

## AWS Setup

### IAM Roles
| Role | Policies |
|---|---|
| RBAC-Admin-Role | S3 Full, DynamoDB Full, Lambda Full, CloudWatch Full, IAM ReadOnly |
| RBAC-Member-Role | S3 Full, DynamoDB Full, Lambda Full |
| RBAC-Viewer-Role | S3 ReadOnly, DynamoDB ReadOnly |

### DynamoDB Table
```
Table name:    RBAC-Calculator
Partition key: role_name (String)
```

### Lambda Function
```
Function name: rbac-calculator-check
Runtime:       Node.js 20.x
Trigger:       API Gateway (HTTP)
Purpose:       Calculates ALLOWED or BLOCKED for each action
```

## Local Setup

1. Clone the repo
```bash
git clone https://github.com/kishorem2510/rbac-calculator.git
cd rbac-calculator
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local`
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=RBAC-Calculator
LAMBDA_API_URL=your_lambda_url
```

4. Run the app
```bash
npm run dev
```

5. Open browser
```
http://localhost:3000
```

## How to Use
```
Step 1 → Select a role
Step 2 → Check actions you want to test
Step 3 → Click CALCULATE ACCESS
Step 4 → See ALLOWED or BLOCKED
```

## Environment Variables

| Variable | Purpose |
|---|---|
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| AWS_REGION | AWS region |
| DYNAMODB_TABLE_NAME | DynamoDB table name |
| LAMBDA_API_URL | API Gateway URL |
# ProposalPilot Frontend

AI-powered proposal & scope generator for freelancers and agencies.

## Tech Stack

- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: React Context (Auth)
- **HTTP**: Axios
- **Animations**: Framer Motion

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Loader.tsx
│       └── Modal.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   └── api.ts
├── routes/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ProposalNew.tsx
│   ├── ProposalDetail.tsx
│   ├── Templates.tsx
│   ├── Profile.tsx
│   └── Billing.tsx
├── styles/
│   └── index.css
├── App.tsx
└── main.tsx
```

## Features

- ✅ Landing page with hero, features, pricing
- ✅ Authentication (Login/Register)
- ✅ Protected routes
- ✅ Dashboard with proposals list
- ✅ AI-powered proposal generation
- ✅ Proposal detail view with copy/duplicate/export
- ✅ Templates management
- ✅ User profile management
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS and Framer Motion

## API Integration

The app expects a backend API with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /proposals` - List proposals
- `GET /proposals/:id` - Get proposal details
- `POST /proposals` - Create proposal
- `POST /ai/generate-proposal` - Generate proposal with AI
- `GET /templates` - List templates
- `POST /templates` - Create template
- `PUT /me` - Update user profile

All protected endpoints require a Bearer token in the Authorization header.


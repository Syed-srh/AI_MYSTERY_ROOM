# 🕯️ AI Mystery Room

An interactive web app that transforms any scenario into a playable detective investigation — powered by **Google Gemini AI**.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini 2.0 Flash

## Project Structure
```
AI Mystery Room Project/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios API calls
│       ├── components/  # UI Components
│       ├── hooks/       # Custom React hooks
│       └── pages/       # Page views
└── server/          # Express backend
    ├── models/      # Mongoose schemas
    └── routes/      # API routes
```

## Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`)
- A Google Gemini API key ([get one here](https://aistudio.google.com/))

### 1. Configure Environment
```bash
# In the server/ directory:
cp server/.env.example server/.env
# Then edit server/.env and set your GEMINI_API_KEY
```

### 2. Start the Backend
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd client
npm run dev
# Opens on http://localhost:5173
```

## How to Play
1. Enter any scenario on the landing page
2. Wait ~20 seconds while AI generates the full case
3. Review WhatsApp messages, camera feeds, and physical clues
4. Select your suspect and submit your accusation
5. See if you cracked the case!

## Deploy with Render and MongoDB Atlas

The application deploys as two Render services:

1. Create a MongoDB Atlas free database and allow network access from `0.0.0.0/0`.
2. Create a Render **Web Service** from this repository:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables: `MONGODB_URI`, `GEMINI_API_KEY`, and `CLIENT_ORIGIN`
3. Create a Render **Static Site** from this repository:
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`
4. Replace the backend `CLIENT_ORIGIN` value with the final Render static-site URL and redeploy the backend.

Keep `server/.env` local. Add production secrets in Render's environment-variable settings, not in Git.

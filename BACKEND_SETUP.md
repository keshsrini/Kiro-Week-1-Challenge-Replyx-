# Backend Setup Guide

## Overview
This project uses a Node.js/Express backend server to proxy Claude API requests, avoiding CORS issues and keeping the API key secure.

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```
This will start:
- Frontend (Vite) on http://localhost:3000
- Backend (Express) on http://localhost:3001

### Option 2: Run Separately
In one terminal:
```bash
npm run dev
```

In another terminal:
```bash
npm run server
```

## How It Works

1. **Frontend** (React/Vite) runs on port 3000
2. **Backend** (Express) runs on port 3001
3. When you generate an email response:
   - Frontend sends request to `http://localhost:3001/api/generate-response`
   - Backend reads API key from `.env` file
   - Backend calls Claude API with your API key
   - Backend returns the response to frontend

## API Endpoints

### POST `/api/generate-response`
Generate an email response using Claude AI.

**Request Body:**
```json
{
  "userName": "John Doe",
  "senderName": "Jane Smith",
  "receivedEmail": "Email content here...",
  "tone": "professional",
  "additionalContext": "Optional context"
}
```

**Response:**
```json
{
  "response": "Generated email response..."
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Environment Variables

Make sure your `.env` file contains:
```
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

## Troubleshooting

**Error: "Failed to generate response. Please ensure the backend server is running."**
- Make sure the backend server is running on port 3001
- Check that you're using `npm run dev:all` or have started the server separately

**Error: "API key not configured on server"**
- Verify your `.env` file has `VITE_ANTHROPIC_API_KEY` set
- Restart the backend server after updating `.env`

**Port already in use:**
- Change the PORT in `server.js` or kill the process using that port

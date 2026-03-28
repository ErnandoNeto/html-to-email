# HTML to Email

Send any HTML file as an email — with a clean interface and zero friction.

## Overview

HTML to Email is a simple tool that lets you upload an HTML file and send it directly as an email. It's useful for testing email templates, sending proposals, or delivering any HTML content via email without needing to integrate an email service yourself.

- **Frontend:** Static HTML/CSS/JS with drag-and-drop file support and live preview
- **Backend:** Node.js + Express API powered by [Resend](https://resend.com)
- **Languages:** PT-BR / EN toggle built in

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env   # fill in your credentials
npm install
npm run dev
```

**Environment variables:**

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key |
| `FROM_EMAIL` | Sender address (must be from a verified domain) |
| `PORT` | Port to run the server (default: `3001`) |

### Frontend

Just open `frontend/index.html` in your browser. No build step needed.

Make sure the `API_URL` in `frontend/script.js` points to your backend.

## API

### `POST /send`

Sends an HTML file as an email.

**Body** (`multipart/form-data`):

| Field | Type | Required | Description |
|---|---|---|---|
| `html` | File | Yes | The `.html` file to send |
| `to` | String | Yes | Recipient email address |
| `subject` | String | No | Email subject line |

**Response:**

```json
{ "success": true, "id": "email-id" }
```

## Deployment

- **Backend:** [Render](https://render.com) — connect your GitHub repo, set root directory to `backend/`, add env vars
- **Frontend:** [Netlify](https://netlify.com) — connect your GitHub repo, set publish directory to `frontend/`

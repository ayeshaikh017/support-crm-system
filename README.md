# Support CRM-Ticket Management System

A small customer-support CRM: log a support ticket, browse and filter the queue,
open a ticket, move it through its lifecycle, and keep a running log of internal
notes against it.

Built as a MERN stack application with a React + Vite frontend and an
Express + MongoDB REST API, deployed as two separate services on Render.

---

## Live Demo

| **URL** |https://github.com/user-attachments/assets/eb93d77f-f252-4755-854d-471b7f0b85cb|
| **Frontend** | https://support-crm-system-1-urq3.onrender.com |
| **API** | https://support-crm-system-qrm6.onrender.com/api |
| **API health check** | https://support-crm-system-qrm6.onrender.com/api/health |

> **Note on first load:** the API runs on Render's free tier, which spins the
> service down after a period of inactivity. The first request after that can
> take up to about a minute while it starts again; everything after that is
> fast. Open the health-check URL a minute before a demo to wake it up.

---

## Features

- **Create a ticket**: customer name, email, issue title and description, with
  required-field and email-format validation in the form.
- **Ticket queue**: all tickets, newest first, in a table showing ID, customer,
  subject, colour-coded status and creation date.
- **Search**: one box searches across ticket ID, customer name, customer email,
  subject and description (case-insensitive, partial match). Special characters
  such as `(`, `+` or `.` are matched as plain text.
- **Filter by status**: Open / In Progress / Closed, combinable with search.
- **Ticket detail**: the full ticket, customer info and the complete note history.
- **Status workflow**: move a ticket between Open, In Progress and Closed.
- **Internal notes**: append timestamped notes to a ticket. Notes cannot be
  edited once written, so they read as a history of what was done.
- **Auto-generated ticket IDs**: human-readable (`TKT-<timestamp>`), with
  uniqueness enforced by a database index.
- **Shareable URLs**: every ticket has its own address, e.g. `/tickets/TKT-1789983737312`.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | **React 19** | Component model fits the three-screen structure; hooks keep state handling small with no external state library. |
| Build tool | **Vite 8** | Fast dev server with hot reload; builds a plain static `dist/` folder that any static host can serve. |
| Routing | **React Router 7** | Client-side routing with URL params (`/tickets/:ticketId`), so ticket links can be shared. |
| Styling | **Bootstrap 5** | The brief prioritises working software over custom design; Bootstrap gives a clean, responsive UI with no CSS build step. |
| HTTP client | **axios** | One configured instance (`client/src/services/api.js`) holds the API base URL, so no component hardcodes a host. |
| API | **Express 5** | Minimal routing layer: four ticket endpoints in one router file, plus a health check in `server.js`. |
| Database | **MongoDB Atlas** | The document model maps directly onto tickets and notes; the managed free tier needs no self-hosted database. |
| ODM | **Mongoose 9** | Schema validation, the status enum, and automatic `created_at` / `updated_at` timestamps at the model layer. |
| Hosting | **Render** | Frontend as a static site, API as a web service, both deployed from this repository. |
| Testing | **Jest + Supertest** | A small set of API tests that send real HTTP requests to the routes, with the database mocked. |

**Deliberately not included:** authentication, pagination, Docker and
TypeScript. The brief asks for a simple two-table app and explicitly warns
against over-engineering, so the scope stops at the requirements.

---

## Project Structure

```
support-crm-system/
├── client/                      # React + Vite frontend (Render static site)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Top navigation
│   │   ├── pages/
│   │   │   ├── TicketList.jsx   # "/"                   list + search + filter
│   │   │   ├── CreateTicket.jsx # "/create-ticket"      new-ticket form
│   │   │   └── TicketDetail.jsx # "/tickets/:ticketId"  detail + status + notes
│   │   ├── services/
│   │   │   └── api.js           # Configured axios instance (single API base URL)
│   │   ├── App.jsx              # Route definitions
│   │   ├── main.jsx             # Entry point, BrowserRouter, Bootstrap imports
│   │   └── index.css            # Small global style overrides
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.html
│   └── vite.config.js
│
├── server/                      # Express + MongoDB API (Render web service)
│   ├── config/
│   │   └── db.js                # Mongoose connection
│   ├── models/
│   │   ├── Ticket.js            # Ticket schema
│   │   └── Note.js              # Note schema
│   ├── routes/
│   │   └── tickets.js           # All ticket and note endpoints
│   ├── tests/
│   │   └── tickets.test.js      # API tests (Jest + Supertest)
│   ├── .env.example
│   └── server.js                # App setup: CORS, JSON parsing, routes, health check
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js 20.19+, 22.13+ or 24+** (the versions supported by Vite 8, Mongoose 9
  and ESLint 10). Check with `node -v`.
- **npm**, which comes with Node.js.
- **A MongoDB database**: either MongoDB running locally, or a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster. For local
  development, use a separate database from the deployed app, so test tickets
  don't appear on the live site.

### 1. Clone

```bash
git clone https://github.com/ayeshaikh017/support-crm-system.git
cd support-crm-system
```

### 2. Start the API

```bash
cd server
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

Open `server/.env` and set `MONGO_URI` (see [Environment Variables](#environment-variables)).

```bash
npm run dev                   # restarts automatically on save (nodemon)
# or: npm start               # plain node
```

Once it starts you should see `Server running on port 5000` followed by
`MongoDB connected successfully`. Check it by opening
http://localhost:5000/api/health in a browser, or with curl (in Windows
PowerShell, type `curl.exe`):

```bash
curl http://localhost:5000/api/health
# {"ok":true}
```

> If you see `MongoDB connection failed: ...` and the process exits, the
> `MONGO_URI` is wrong or unreachable. On Atlas, check that your current IP is
> allowed under **Network Access** and that the password in the URI is URL-encoded.

### 3. Start the frontend

In a **second terminal**, from the repository root:

```bash
cd client
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Vite prints a local URL (default **http://localhost:5173**). Open it and you
should see the ticket queue. Create a ticket to confirm both halves are talking.

> The API allows browser requests only from `CLIENT_URL`, which defaults to
> `http://localhost:5173`. If the frontend runs on a different port (Vite moves
> to another port when 5173 is taken, and `npm run preview` serves on
> `http://localhost:4173`), set `CLIENT_URL` in `server/.env` to that exact
> address and restart the server.

### Available scripts

**`server/`**

| Command | Description |
|---|---|
| `npm start` | Start the API with node |
| `npm run dev` | Start the API with nodemon (restarts on file changes) |
| `npm test` | Run the API tests (see [Testing](#testing)) |

**`client/`**

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Production build into `client/dist/` |
| `npm run preview` | Serve the built `dist/` folder locally |
| `npm run lint` | Run ESLint over the client code |

---

## Testing

The API has a small set of tests in `server/tests/tickets.test.js`, written with
Jest and Supertest. They send real HTTP requests to the Express routes, with the
Mongoose models replaced by mocks, so they need no database and no `.env` file.

```bash
cd server
npm test
```

What they check:

| Endpoint | Test |
|---|---|
| `POST /api/tickets` | Creates a ticket and returns its `ticket_id` and `created_at` |
| `POST /api/tickets` | Returns 400 and saves nothing when a field is missing |
| `GET /api/tickets` | Filters by status, searches all five fields, sorts newest first |
| `GET /api/tickets` | Treats special characters in the search (`(`, `.*`) as plain text |
| `GET /api/tickets/:ticket_id` | Returns the ticket together with its notes |
| `GET /api/tickets/:ticket_id` | Returns 404 for a ticket that doesn't exist |
| `PUT /api/tickets/:ticket_id` | Updates the status and appends a note |

Because the database is mocked, the tests check the API's own logic, not MongoDB
itself. The frontend has no automated tests.

---

## Environment Variables

Each app reads its settings from a `.env` file in its own folder. Each folder has
a committed `.env.example` listing what is needed; the real `.env` files are
gitignored.

### `server/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | **Yes** | none | MongoDB connection string. Local: `mongodb://127.0.0.1:27017/support-crm`. Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support-crm`. The server logs the error and exits if it cannot connect. |
| `PORT` | No | `5000` | Port the API listens on. **On Render, leave this unset**: the platform sets it. |
| `CLIENT_URL` | No | `http://localhost:5173` | The one frontend origin allowed by CORS. Must be the exact origin with no trailing slash, e.g. `https://support-crm-system-1-urq3.onrender.com`. |

### `client/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | none | Base URL of the API, **including the `/api` path**. Local: `http://localhost:5000/api`. Production: `https://support-crm-system-qrm6.onrender.com/api`. |

> **Two things to know about `VITE_API_URL`:**
> 1. Vite bakes it into the frontend at **build** time. Changing it on Render
>    needs a redeploy; restarting is not enough.
> 2. If it is unset, requests go to the frontend's own address instead of the
>    API, and the ticket list fails to load. Check this variable first if that happens.

---

## API Reference

**Base URL (local):** `http://localhost:5000/api`
**Base URL (production):** `https://support-crm-system-qrm6.onrender.com/api`

Request bodies must be JSON (`Content-Type: application/json`), and the
endpoints below respond with JSON. There is no authentication (see
[Known Limitations](#known-limitations--next-steps)).

### `GET /api/health`

Liveness check, useful for waking the free-tier service before a demo.

```json
{ "ok": true }
```

---

### `POST /api/tickets`

Create a ticket. The server generates `ticket_id` and sets `status` to `"Open"`.

**Request body**

| Field | Type | Required |
|---|---|---|
| `customer_name` | string | yes |
| `customer_email` | string | yes |
| `subject` | string | yes |
| `description` | string | yes |

```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Aisha Khan",
    "customer_email": "aisha.khan@example.com",
    "subject": "Cannot reset my password",
    "description": "The reset link in the email returns an expired-token page."
  }'
```

**`201 Created`**

```json
{
  "ticket_id": "TKT-1789983737312",
  "created_at": "2026-09-21T09:42:17.312Z"
}
```

**`400 Bad Request`**: one or more fields missing

```json
{ "message": "All fields are required" }
```

---

### `GET /api/tickets`

List tickets, newest first.

**Query parameters**

| Parameter | Type | Description |
|---|---|---|
| `status` | string | Exact match on `Open`, `In Progress` or `Closed`. Omit for all. |
| `search` | string | Case-insensitive partial match against `ticket_id`, `customer_name`, `customer_email`, `subject` **or** `description`. Matched as plain text. |

Both parameters can be combined.

```bash
curl "http://localhost:5000/api/tickets?status=Open&search=password"
```

**`200 OK`**

```json
[
  {
    "_id": "6712f0a1c3b2d41f8c9e4a21",
    "ticket_id": "TKT-1789983737312",
    "customer_name": "Aisha Khan",
    "customer_email": "aisha.khan@example.com",
    "subject": "Cannot reset my password",
    "description": "The reset link in the email returns an expired-token page.",
    "status": "Open",
    "created_at": "2026-09-21T09:42:17.312Z",
    "updated_at": "2026-09-21T09:42:17.312Z",
    "__v": 0
  }
]
```

An empty result returns `[]`, not a 404.

---

### `GET /api/tickets/:ticket_id`

Fetch one ticket together with all of its notes, newest note first.
`:ticket_id` is the human-readable `TKT-...` ID, not the MongoDB `_id`.

```bash
curl http://localhost:5000/api/tickets/TKT-1789983737312
```

**`200 OK`**

```json
{
  "ticket": {
    "_id": "6712f0a1c3b2d41f8c9e4a21",
    "ticket_id": "TKT-1789983737312",
    "customer_name": "Aisha Khan",
    "customer_email": "aisha.khan@example.com",
    "subject": "Cannot reset my password",
    "description": "The reset link in the email returns an expired-token page.",
    "status": "In Progress",
    "created_at": "2026-09-21T09:42:17.312Z",
    "updated_at": "2026-09-21T10:05:44.901Z",
    "__v": 0
  },
  "notes": [
    {
      "_id": "6712f5b8c3b2d41f8c9e4a3f",
      "ticket_id": "TKT-1789983737312",
      "note_text": "Called the customer; reset link had expired. Re-sent manually.",
      "created_at": "2026-09-21T10:05:44.907Z",
      "__v": 0
    }
  ]
}
```

**`404 Not Found`**

```json
{ "message": "Ticket not found" }
```

---

### `PUT /api/tickets/:ticket_id`

Update a ticket's status, append a note, or both. Both fields are optional.
Sending `notes` always adds a new note; it never edits an existing one.

**Request body**

| Field | Type | Description |
|---|---|---|
| `status` | string | One of `Open`, `In Progress`, `Closed`. Omit to leave unchanged. |
| `notes` | string | Text of a new note to append. Omit to add nothing. |

```bash
curl -X PUT http://localhost:5000/api/tickets/TKT-1789983737312 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "notes": "Called the customer; reset link had expired. Re-sent manually."
  }'
```

**`200 OK`**

```json
{
  "success": true,
  "updated_at": "2026-09-21T10:05:44.901Z"
}
```

**`404 Not Found`**

```json
{ "message": "Ticket not found" }
```

---

### Error responses

| Status | Meaning | Body |
|---|---|---|
| `400` | Required field missing on create | `{ "message": "All fields are required" }` |
| `404` | No ticket with that `ticket_id` | `{ "message": "Ticket not found" }` |
| `500` | Server or database error, and currently other invalid input too (see [Known Limitations](#known-limitations--next-steps)) | `{ "message": "Failed to ..." }` |

The route handlers log error details on the server and return only the generic
messages above. Requests that Express rejects before they reach a route, such as
an unknown path or a body that isn't valid JSON, get Express's default HTML error
page instead.

---

## Database Schema

Two collections, linked by the human-readable ticket ID. Mongoose manages the
timestamps and names them `created_at` / `updated_at`, to keep the API in
snake_case throughout.

### `tickets`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | MongoDB primary key |
| `ticket_id` | String | required, **unique** | Business key, format `TKT-<epoch-ms>`, generated by the server |
| `customer_name` | String | required, trimmed | |
| `customer_email` | String | required, trimmed, lowercased | |
| `subject` | String | required, trimmed | Short issue title |
| `description` | String | required, trimmed | Full issue description |
| `status` | String | one of `Open`, `In Progress`, `Closed` | Defaults to `Open` |
| `created_at` | Date | auto | |
| `updated_at` | Date | auto | Changes when the ticket document itself changes |

### `notes`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `ticket_id` | String | required | Links to `tickets.ticket_id` |
| `note_text` | String | required, trimmed | |
| `created_at` | Date | auto | |

Notes have no `updated_at`: they are append-only, so the list of notes reads as
a history of what was done on a ticket.

### Relationship

```
tickets (1) ──────< (many) notes
   ticket_id  ==  notes.ticket_id
```

**Why a string key rather than an ObjectId reference:** `ticket_id` is the ID
the UI and the URL already use (`/tickets/TKT-1789983737312`), so the detail
endpoint can look up the ticket and its notes from the same route parameter.
The trade-off is that MongoDB does not enforce the link: deleting a ticket would
leave its notes behind. With no delete endpoint in scope, that is acceptable here.

---

## Deploying to Render

The app runs as **two separate Render services** from one repository, each
pointed at its own folder with the **Root Directory** setting.

### API: Render Web Service

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

Environment variables:

| Key | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `CLIENT_URL` | the frontend's URL, e.g. `https://support-crm-system-1-urq3.onrender.com` |

Do **not** set `PORT`: Render sets it, and the server already reads `process.env.PORT`.

**MongoDB Atlas:** Render's free tier has no fixed outgoing IP address, so under
**Network Access** allow `0.0.0.0/0`. Without this the service starts, fails to
connect, and exits.

### Frontend: Render Static Site

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Environment variable:

| Key | Value |
|---|---|
| `VITE_API_URL` | the API's URL including `/api`, e.g. `https://support-crm-system-qrm6.onrender.com/api` |

### Rewrite rule for page refreshes

A static host serves files by path. Opening `/create-ticket` or
`/tickets/TKT-1789983737312` directly (or refreshing it) asks for a file that
doesn't exist, so the host returns 404, even though React Router would handle
that route once the app has loaded.

To fix this, add a rule in the static site's **Redirects / Rewrites** settings:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | **Rewrite** |

Every path then serves `index.html`, React Router starts, reads the URL and shows
the right page. The action must be **Rewrite**, not Redirect: a redirect would
change the address to `/` and lose the ticket ID.

---

## Known Limitations & Next Steps

Kept out of scope on purpose, to match the brief:

- **No authentication.** Anyone with the API URL can read and update tickets.
  Ticket descriptions can hold customer details, so agent login would be the
  first thing to add in production.
- **No pagination.** The list endpoint returns every ticket in one response.
  That is fine at this size; for hundreds of tickets a day it would need
  server-side pagination.

Known rough edges:

- **Validation errors other than a missing field return 500 instead of 400**,
  for example a request sent without a JSON body, a status outside the three
  allowed values, or fields that contain only spaces. The form prevents these,
  so it only affects direct API calls.
- **There is no custom error handler**, so requests rejected before they reach a
  route (for example invalid JSON) get Express's default HTML error page, which
  includes a stack trace unless `NODE_ENV=production` is set.
- **Email format is only checked in the browser**, not by the API.
- **Adding a note without changing the status does not change the ticket's
  `updated_at`**, because the note is stored in its own collection.
- **Ticket IDs are timestamps.** Two tickets created in the same millisecond
  would get the same ID; the unique index rejects the second one, which then
  gets an error instead of a ticket.
- **Search uses case-insensitive pattern matching** across five fields, which
  can't use an index. Fine at this size; at scale it would need a text index or
  Atlas Search.

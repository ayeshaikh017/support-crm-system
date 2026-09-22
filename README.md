# support-crm-system
MERN-based customer support CRM for managing tickets, statuses, search, and notes.
# Support CRM System

A full-stack customer support CRM system built with the MERN stack to manage customer support tickets, statuses, searches, and notes.

## Overview

Support CRM System is a web-based customer support ticket management application.

It allows support teams to:

- Create customer support tickets
- View all tickets
- Search tickets by customer name, email, ticket ID, subject, or description
- Filter tickets by status
- View detailed ticket information
- Update ticket status
- Add notes or comments to tickets

## Tech Stack

### Frontend
- React.js
- Bootstrap
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- MongoDB Atlas

## Project Structure

```text
support-crm-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md

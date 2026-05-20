# Auto-Store

Mini MERN-style 3D car e-commerce project with:

- **Backend**: Node.js + Express + MongoDB (uses in-memory MongoDB automatically if `MONGODB_URI` is not provided)
- **Frontend**: React 19 + React Router + Redux Toolkit
- **Catalog**: 100 cars from 10 companies with PKR pricing and detail specs
- **Accounts**: Email/password auth, profile editing, order history
- **Admin**: Catalog CRUD with role-protected routes

## Run locally

### 1) Backend

```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:4000`.

> **Admin seed (in-memory mode)**  
> Set `ADMIN_PASSWORD` to control the seeded admin password (email: `admin@autostore.com`).  
> If not set in development, a random password is generated and logged on startup.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Tests

```bash
cd .
npm test
```

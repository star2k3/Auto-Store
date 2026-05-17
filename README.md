# Auto-Store

Mini MERN-style 3D car e-commerce project with:

- **Backend**: Node.js + Express + MongoDB (uses in-memory MongoDB automatically if `MONGODB_URI` is not provided)
- **Frontend**: React 19 + React Router + Redux Toolkit
- **Catalog**: 100 cars from 10 companies with PKR pricing and detail specs
- **Images**: Stored in MongoDB and served from `/api/products/:id/image` when `MONGODB_URI` is set

## Run locally

### 1) Backend

```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:4000`.

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

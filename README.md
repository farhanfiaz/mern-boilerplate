# MERN Boilerplate

A production‑ready starter kit for building **full‑stack** applications with **Express, React, Node.js** (MERN) and **PostgreSQL** via Drizzle ORM. It ships with a modern UI powered by **React 19**, **Radix UI**, **Tailwind CSS**, and a robust backend featuring **JWT authentication**, **rate limiting**, **security headers**, **file uploads**, and **structured logging**.

## ✨ Features

- **Authentication & Authorization**: Secure JWT‑based login, role‑based access, password hashing with bcryptjs.
- **Database Layer**: PostgreSQL integration using **Drizzle ORM** with migration and seed scripts (`drizzle-kit`).
- **API Rate Limiting & Security**: `express-rate-limit`, `helmet`, CORS configuration.
- **File Uploads**: Multer handling for multipart/form‑data, with an `uploads/` directory.
- **Logging**: Winston logger with daily rotation and Loki transport for centralized log aggregation.
- **Frontend UI**: React 19 + Vite, styled with **Tailwind CSS**, **Radix UI** components, **react‑router‑dom**, **react‑query** and **react‑hook‑form** for data fetching and form validation.
- **State Management**: Built‑in support for **TanStack Query** with devtools.
- **Responsive Design**: Tailwind utilities, dark mode ready, and utility‑first styling.
- **Development Experience**:
  - Hot‑reload with Vite (`npm run dev`).
  - Concurrent server & client development via `concurrently` scripts.
  - ESLint + Prettier configuration for code quality.
- **Testing Utilities**: (placeholder for adding Jest/React Testing Library).

## 🛠️ Tech Stack

- **Backend**: Node.js (v18+), Express, TypeScript, Drizzle ORM, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, React Query, Zod for schema validation
- **Tooling**: ESLint, Prettier, Winston, dotenv, concurrently

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/farhanfiaz/mern-boilerplate.git
cd mern-boilerplate

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# edit .env with your DB credentials, JWT secret, etc.

# Run database migrations & seed (if needed)
npm run db:push   # generate schema
npm run db:seed   # optional seed data

# Start development servers (client + server)
npm run dev
```

The client will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## 📜 Scripts Overview

| Script | Description |
|--------|-------------|
| `dev` | Starts Vite dev server and backend concurrently |
| `dev:watch` | Runs server with Nodemon watch |
| `build` | Builds client bundle for production |
| `db:generate` | Generates Drizzle ORM types |
| `db:push` | Pushes migrations to the database |
| `db:migrate` | Runs pending migrations |
| `db:seed` | Executes seed scripts |
| `lint` | Runs ESLint across the project |
| `format` | Formats code with Prettier |

## 🚀 Usage

- Create accounts via `/api/auth/register` (email + password).
- Authenticate to receive a JWT token; include it in `Authorization: Bearer <token>` headers for protected routes.
- Upload files to `/api/uploads` (multipart/form‑data).
- Use the React UI components to interact with the API (login, dashboard, file manager, etc.).

## 🤝 Contributing

Contributions are welcome! Please open issues and submit pull requests following the conventional commit style.




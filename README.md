# rest-express

A full-stack task management application built with React, Express, and PostgreSQL. This project provides a secure and efficient way to manage tasks with user authentication, a modern React frontend, and a robust Express backend API.

## Features

- User authentication with Passport.js
- Create, read, update, and delete (CRUD) tasks
- Protected routes for authenticated users
- Responsive React frontend using TailwindCSS and Radix UI components
- Backend REST API built with Express and TypeScript
- PostgreSQL database managed with Drizzle ORM
- Real-time notifications with React Query and Toaster
- Development and production build setup with Vite

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Radix UI, React Query, Wouter (routing)
- **Backend:** Express, TypeScript, Passport.js (authentication), Drizzle ORM
- **Database:** PostgreSQL
- **Build Tools:** Vite, esbuild
- **Other:** Zod for schema validation, Framer Motion for animations

## Project Structure

```
/client          # React frontend source code
/server          # Express backend source code
/shared          # Shared schema definitions and types
/drizzle.config.ts  # Drizzle ORM database configuration
/package.json    # Project dependencies and scripts
```

## Technical Architecture

The application is structured as a full-stack project with a clear separation between frontend and backend:

- The **frontend** is built with React and TypeScript, styled using TailwindCSS and Radix UI components for accessibility and responsiveness. React Query manages server state and caching, while Wouter handles client-side routing.
- The **backend** is an Express server written in TypeScript, providing a REST API with user authentication via Passport.js. Drizzle ORM is used for type-safe database interactions with PostgreSQL.
- Shared schema definitions and types are maintained in the `/shared` directory to ensure consistency between frontend and backend.
- Vite is used as the build tool for both frontend and backend, enabling fast development with hot module replacement and optimized production builds.

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**

  - `id` (primary key, auto-increment)
  - `username` (unique, not null)
  - `password` (hashed, not null)
  - `name` (not null)

- **tasks**
  - `id` (primary key, auto-increment)
  - `title` (not null)
  - `description` (optional)
  - `completed` (boolean, default false)
  - `priority` (text, default "Medium"; values: Low, Medium, High)
  - `createdAt` (timestamp, default current time)
  - `userId` (foreign key referencing users.id, not null)

The database schema is managed using Drizzle ORM with Zod schemas for validation.

## Installation and Setup

### Backend Setup

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory with the following:

```
DATABASE_URL=your_postgresql_database_url
```

3. **Run database migrations**

```bash
npm run db:push
```

4. **Run the development server**

```bash
npm run dev
```

This will start the Express server with Vite for frontend hot reloading on port 5000.

### Frontend Setup

The frontend is served by the backend server during development and production. To work on the frontend separately, navigate to the `/client` directory and run:

```bash
npm install
npm run dev
```

This will start the frontend development server with hot reloading.

## How to Run the Project

- To run the project in development mode with hot reloading, use:

```bash
npm run dev
```

- To build the project for production and start the server, use:

```bash
npm run build
npm start
```

- The application will be accessible at:

```
http://localhost:5000
```

- Use the web interface to register or log in and manage your tasks.

## Usage

- Access the app in your browser at `http://localhost:5000`
- Register or log in to manage your tasks
- Create, update, and delete tasks securely with your account

## License

This project is licensed under the MIT License.

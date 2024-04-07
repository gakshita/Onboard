# MERN Project
This repository contains the code for the MERN project, which is a simple sign-up and login flow for an e-commerce website where users can mark categories they are interested in. The project utilizes a tech stack recommended by the guidelines, including Next.js, tRPC, Prisma, and Tailwind CSS.

## Deployment
The application is deployed on Vercel's free tier. You can access the live demo [here](https://rocket-assignment-psi.vercel.app/signup).

## Tech Stack
- Database: PostgreSQL from Neon or another RDBMS provider.
- Framework: Create.t3.gg for Next.js, tRPC, Prisma, and Tailwind CSS.
- VCS: GitHub for code repository (public).
- App Hosting: Vercel's free tier or another free Next.js hosting provider.

## Demo Video
[Demo](https://www.loom.com/embed/4f2522736b3041f3bcc3d884fe5491c8)

## Features
User registration and login functionality.
JWT and OTP based Authentication.
Category selection for users.
Paginated category list with dynamic pagination.


## Setup Instructions
- Install dependencies:

```
cd mern
npm install
```

- Configure the database:

Set up a PostgreSQL database (e.g., from Neon or another provider).
Update the DATABASE_URL in the .env file with your database connection URL.

- Run database migrations:

```
npx prisma migrate dev
Start the development server:
```

```
npm run dev
```
- Open your browser and navigate to http://localhost:3000 to view the application.


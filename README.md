# IsleVerse - Video Communication Platform
![View Count Badge](https://img.shields.io/badge/views-100%2B-brightgreen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-nishantdecode-blue)](https://linkedin.com/in/nishantdecode)

[![Demo Video](https://i.ibb.co/yShj5px/isleverse-Screenshot.jpg)](https://drive.google.com/file/d/1U0OnmX2sftXwjKoXklbUEi2D8a2Sbd67/view)

IsleVerse is a real-time communication platform built with [Next.js](https://nextjs.org/), leveraging WebRTC, WebSockets, and peer-to-peer communication for seamless video calling. This project was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and is designed for responsive and robust video interactions.

## Project Structure and Key Technologies
This application is structured with separate frontend and backend modules that connect through a WebSocket and API-based architecture. Here's a high-level overview of each:

### Frontend - `isleverse-fe`
Developed with Next.js and styled using Tailwind CSS, the frontend provides a responsive, real-time video and chat interface. The SocketProvider component handles WebSocket initialization, media stream access, and peer connection management. 

#### Key Libraries and Technologies
- **Next.js**: For server-side rendering and optimized builds.
- **Tailwind CSS**: For responsive and consistent styling.
- **Socket.io Client**: Facilitates WebSocket-based communication with the backend.
- **Simple Peer**: Manages peer-to-peer communication for WebRTC.
- **Shad/cn UI**: Offers accessible and customizable components (avatars, dialogs, etc.).
- **Framer Motion**: Adds animations for enhanced UI interactions.

### Backend - [isleverse-be](https://github.com/nishantdecode/isleverse-be)

Built with Node.js and Express, the backend efficiently manages user authentication, session handling, and real-time data synchronization. It integrates WebSocket for real-time communication, while leveraging MongoDB for data storage.

#### Key Libraries and Technologies
- **Express.js**: A fast, minimalist web framework for handling HTTP requests.
- **Socket.io Server**: Enables WebSocket-based, real-time bidirectional communication with the frontend.
- **Mongoose**: An ODM for MongoDB, providing a schema-based solution for handling data.
- **JWT (JSON Web Token)**: Used for secure user authentication and authorization.
- **Bcrypt**: Implements password hashing for enhanced security.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

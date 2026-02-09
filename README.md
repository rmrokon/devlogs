# DevLogs - Developer Activity Tracker

DevLogs is a developer activity tracking tool that aggregates your coding stats from GitHub and presents them in a beautiful, insightful dashboard. It helps you visualize your coding habits, track your streaks, and showcase your achievements with embeddable widgets.

## Project Overview

DevLogs serves as a central hub for developers to monitor their productivity. It connects to your GitHub account to sync repositories, commits, and language discrepancies, providing a granular view of your development lifecycle.

The project is structured as a modern monorepo with a distinct separation of concerns:
- **Backend**: robust REST API built with Express, Sequelize, and PostgreSQL.
- **Frontend**: responsive and interactive web application built with Next.js 16 and React 19.

## My Contributions

As the lead developer, I architected and implemented the core features of DevLogs:

- **Dashboard Implementation**: Designed and built the interactive dashboard that displays real-time statistics, including commit trends, top languages, and active repositories.
- **GitHub Sync Logic**: Developed the backend logic to securely authenticate with GitHub, fetch repository data, and calculate commit statistics.
- **Embeddable Widgets**: Created the "Share" feature that generates an iframe snippet, allowing users to embed their DevLogs stats on personal portfolios or blogs.
- **Full-Stack Architecture**: Set up the complete development environment using Docker for easy deployment and orchestrated the communication between the Next.js frontend and the Express backend.

## Key Features

- **GitHub Integration**: Seamless OAuth login and automatic synchronization of your GitHub data.
- **Activity Dashboard**:
    - **Commit Trends**: Visual graphs showing your daily commit activity.
    - **Language Breakdown**: Analysis of the programming languages you use most.
    - **Streak Tracking**: Motivation to keep coding every day with current and longest streak counters.
- **Embeddable Stats**: Customizable widgets to share your coding proof-of-work anywhere on the web.
- **Repository Management**: detailed view of your most active repositories.
- **Responsive Design**: optimized for both desktop and mobile viewing with a modern, clean UI.

## Technologies Used

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Charts**: [Recharts](https://recharts.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Authentication**: JWT & GitHub OAuth
- **Validation**: [Zod](https://zod.dev/)

### DevOps
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
- **Language**: TypeScript (Full Stack)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (Optional)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devlogs
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - API: [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

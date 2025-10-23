# Node.js Pub-Sub System

A simple publish-subscribe system built with Node.js, Express, and Redis.

## Project Structure

```
node-pub-sub/
├── primary-backend/     # Publisher service
├── secondary-backend/   # Subscriber/Worker service
└── README.md
```

## Overview

This project demonstrates a basic pub-sub pattern using Redis as the message broker:

- **Primary Backend**: Receives submissions via HTTP API and publishes them to a Redis queue
- **Secondary Backend**: Acts as a worker that processes submissions from the Redis queue

## Features

- HTTP API for submitting code submissions
- Redis-based message queue for reliable message delivery
- Worker service for processing submissions
- TypeScript support
- Docker support

## Prerequisites

- Node.js
- Redis server
- pnpm (or npm)

## Getting Started

### 1. Start Redis Server

Make sure Redis is running on `localhost:6380` (or update the `REDIS_URL` environment variable).

### 2. Install Dependencies

```bash
# Install dependencies for primary backend
cd primary-backend
pnpm install

# Install dependencies for secondary backend
cd ../secondary-backend
pnpm install
```

### 3. Build and Run

#### Primary Backend (Publisher)

```bash
cd primary-backend
pnpm run build
pnpm run start
```

#### Secondary Backend (Worker)

```bash
cd secondary-backend
pnpm run build
pnpm run start
```

## API Usage

### Submit a Code Submission

Send a POST request to `http://localhost:3000/submit`:

```json
{
  "problemId": "problem-123",
  "code": "console.log('Hello World');",
  "userId": "user-456",
  "language": "javascript"
}
```

### Health Check

- Primary Backend: `GET http://localhost:3000/`
- Secondary Backend: `GET http://localhost:3001/`

## Environment Variables

- `REDIS_URL`: Redis connection URL (default: `redis://127.0.0.1:6380`)
- `PORT`: Server port (primary: 3000, secondary: 3001)

## Docker Support

Both services include Dockerfiles for containerized deployment.

### Using Docker Compose

The easiest way to run the entire stack is with Docker Compose:

```bash
# Start all services (Redis + both backends)
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

This will start:

- Redis server on port 6380
- Primary backend on port 3000
- Secondary backend on port 3001

## Development

To run in development mode:

```bash
pnpm run dev
```

This will build and start the services automatically.

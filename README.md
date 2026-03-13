# Medium-Like API – Feature Extensions

## Software Architecture Final Project

This project is a robust, production-ready **Medium-like API** extended with advanced features while strictly adhering to **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

---

## 🚀 Features Implemented

### Tags System

Categorize posts with unique, admin-managed tags.

### Post Slugs

SEO-friendly, unique, human-readable URLs for all posts.

### Comments System

Discussion platform for published posts with an advanced authorization matrix.

### Subscriptions & Notifications

Follow authors and receive real-time updates via an **Event-Driven Architecture**.

---

## 🛠️ Prerequisites

- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **Database:** SQLite (built-in)

---

## 📥 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd m2-s2-software-architecture-lab-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory and add the following:

```env
JWT_SECRET=your_super_secret_key_here
PORT=3000
DATABASE_URL=database.sqlite
```

### 4. Database Seeding

The project includes a seed script to pre-populate the database with the required users (Admin, Moderator, Writer, Reader) and sample posts.

```bash
npm run seed
```

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Build

```
npm run build
```

### 📚 API Documentation

Once the app is running, you can access the interactive Swagger/OpenAPI documentation at:

👉 http://localhost:3000/api

### 🧪 Testing

The project includes both unit tests for business logic and E2E tests for API integration.

- Unit Tests:

```
npm run test
```

- Integration (E2E) Tests:

```
npm run test:e2e
```

- Coverage Report:

```
npm run test:cov
```

### 🏗️ Architecture Overview

- This project follows a layered Clean Architecture:

- Domain Layer
  Entities, Value Objects, and Repository Interfaces.

- Application Layer
  Use Cases and Domain Event Handlers.

- Infrastructure Layer
  TypeORM repositories, Controllers, and NestJS Guards.

- Decoupling
  Modules (Posts, Comments, Notifications) communicate exclusively through Domain Events via EventEmitter2.

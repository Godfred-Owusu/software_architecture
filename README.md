# Software Architecture Lab - Blog & Notification System

This project implements a robust blog and notification system using **Clean Architecture** and **Domain-Driven Design (DDD)** principles, built with the NestJS framework.

## 🏗️ Architecture Overview

The project follows the "Screaming Architecture" pattern, where the folder structure reflects the business domain rather than the framework. It is divided into four distinct layers:

1.  **Domain Layer**: The heart of the application. Contains Entities, Value Objects, and Repository interfaces. It is 100% independent of external libraries (except for core logic helpers).
2.  **Application Layer**: Contains Use Cases and Data Transfer Objects (DTOs). This layer orchestrates the execution of business rules.
3.  **Infrastructure Layer**: The "details" layer. Contains TypeORM entities, SQLite repositories, and REST Controllers.
4.  **Shared Layer**: Cross-cutting concerns such as Authentication (JWT), Logging, and Global Exception Filters.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

```bash
npm install
```

### Running the Application

```bash
# Start the server in development mode
npm run start:dev
```

- The API will be available at http://localhost:3000.

### 🧪 Testing Suite

The project includes a comprehensive testing strategy covering both unit and integration levels.

##### 1. Unit Tests (Business Rules)

These tests validate the Use Cases in isolation by mocking the persistence layer.

```bash
npm run test
```

Key Use Cases Tested:

- CreatePost: Ensures titles/content meet length requirements and author roles are validated.

- CreateComment: Validates that comments are only permitted on posts with an accepted status.

- FollowUser: Prevents users from following themselves and handles idempotency.

##### 2. Integration Tests (End-to-End)

These tests perform actual HTTP requests against a live SQLite database to ensure all layers work together.

```bash
npm run test:e2e
```

Test Scenarios:

Post Management: Creating posts and filtering by tags.

Social Interaction: Commenting on accepted posts and following other users.

Notifications: Retrieving real-time activity alerts for the logged-in user.

3. Coverage Analysis
   To generate a full HTML coverage report:

```bash
npm run test:cov
```

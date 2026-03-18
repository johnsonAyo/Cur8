# CUR8 Platform

This project is a full-stack implementation of the CUR8 recommendation engine, designed to showcase transparency in carbon removal project scoring. It evaluates scientific data from suppliers and provides a detailed visual breakdown of how scores are generated.

## 🏗 Project Structure

The project is organized as a monorepo containing two main components:

- **`cur8-backend/`**: A NestJS (TypeScript) API that serves project data, supplier information, and scientific metrics. It includes a proprietary scoring engine.
- **`cur8-frontend/`**: A Next.js (React/TypeScript) application using Tailwind CSS and Shadcn UI. It features a dashboard with advanced filtering and a "Drill-Down" view for score transparency.

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm
- Ensure ports **3000** (Backend) and **3001** (Frontend) are available.

### Quick Start (Recommended)
You can run both the frontend and backend concurrently from the root directory:

1. **Install all dependencies** (Root, Frontend, and Backend):
   ```bash
   npm run install:all
   ```
2. **Start the application**:
   ```bash
   npm start
   ```
This will launch the backend API on `http://localhost:3000` and the frontend dashboard on `http://localhost:3001` simultaneously.

---

### Manual Setup (Alternative)

### 1. Backend Setup (Alternative)
```bash
cd cur8-backend
npm install
npm run start:dev
```
*API runs on `http://localhost:3000`.*

### 2. Frontend Setup (Alternative)
```bash
cd cur8-frontend
npm install
npm run dev
```
*Dashboard runs on `http://localhost:3001`.*

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Features**: Modular architecture, structured scoring engine, centralized constants for business logic.

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Card, Table, Badge, Button, Select)
- **Data Fetching**: Client-side with React Hooks and centralized API utility.

## 🔌 API Design

The API follows a **two-tier data fetching strategy** to optimize performance and reduce payload size:

- **`GET /projects`** — Returns a **lightweight summary** of each project (`ProjectSummary`), containing only the fields needed for the dashboard table: `id`, `name`, `technology`, `status`, `supplierName`, and `overallScore`. This keeps the list response fast and minimal.
- **`GET /projects/:id`** — Returns the **full detailed breakdown** (`ProjectDetailed`) for a single project, including the complete `ScientificMetrics`, `Supplier` information, and the full `ScoreBreakdown` (permanence, trust, financial risk, leakage, and overall scores). This "drill-down" endpoint is only called when a user navigates to an individual project page.

This separation ensures the dashboard loads quickly without fetching unnecessary detail data for every project, while the detail view provides full transparency into how each score is calculated.

## 📊 Scoring Logic & Assumptions

The scoring model follows the "1.0 to 10.0" scale requested in the brief.

### Explicit Requirements Implemented:
- **Permanence Score**: `Durability / 100` (Capped at 10.0).
- **Supplier Trust**: `Verified = 10.0`, `Pending = 5.0`.
- **Financial Risk Base**: `Operational = 10.0`, `In Design = 5.0`, `Discontinued = 1.0`.
- **Leakage Risk**: `Permanence * (1 - Leakage)`.
- **Overall Score**: Equal-weighted average of Financial, Leakage, and Trust scores.

### 🧠 Strategic Assumptions & Decisions:

1. **Static Volume Penalty (Business Logic)**: The brief required a "low Financial Risk score" for projects under 1,000 tonnes. We implemented a **static 0.5 multiplier** (50% penalty) for any volume below this threshold. This ensures strict adherence to the defined business rule, making the risk profile clear and binary for stakeholders.
    - *Alternative Consideration*: In a production environment, a **dynamic linear multiplier** (`volume / 1000`) could be used to provide a smoother risk gradient and reward incremental growth for smaller projects.
2. **UI Transparency ("The Why")**: To address the design challenge for non-technical users, we implemented **color-coded results** in the detail view. These explicitly flag low volume (under 1,000) and unverified status with natural language explanations.
3. **Data Normalization**: Scientific metrics (like leakage) are treated as decimal probabilities (0.0 to 1.0) based on the provided JSON data.
4. **Precision**: All scores are rounded to **2 decimal places** in the UI to ensure a clean, professional appearance while maintaining mathematical accuracy.
5. **Componentization**: Extracted reusable UI components (`ScoreBadge`, `StatusBadge`, `FilterBar`, `ScoreCard`) to ensure consistency and maintainability across the app.
6. **Server-Side Data Processing**: Filtering and sorting are offloaded to the **Backend API** via query parameters. This ensures scalability over managing large datasets in the frontend React state, while providing a snappy, click-to-sort UX on the dashboard table headers.

7. **Tooltip Transparency System**: Implemented a "Two-Layer" tooltip system across all project scores to provide maximum clarity.
    - **Formula Header**: Displays the abstract mathematical formula (e.g., `Durability / 100`).
    - **Value Body**: Shows the actual project-specific numeric values being calculated (e.g., `1000 / 100`).

## 🚀 Observability & Error Handling

We have implemented a robust observability and reliability layer to ensure the platform is both maintainable and resilient.

### 1. Backend Telemetry & Logging
A centralized `LoggingInterceptor` has been implemented in the NestJS backend to provide deep visibility into system performance:
- **Query Pattern Analysis**: Every incoming request is logged with its method, URL, and full query parameters (e.g., `GET /projects?sortOrder=desc`). This helps identify the most frequent user interactions and search behaviors.
- **Performance Benchmarking**: The interceptor calculates the precise processing time for every request, logging the duration in milliseconds. This enables proactive monitoring of bottleneck endpoints.
- **Structured Error Tracing**: Failed requests capture the full stack trace and request context, allowing for rapid debugging of production issues.

### 2. Graceful Error Handling (Front & Back)
The platform is designed to "fail gracefully" rather than crash:
- **Global Error Boundaries**: A dedicated `error.tsx` page in the Next.js App Router catches unexpected frontend crashes, providing a premium recovery UI with "Try Again" and "Back to Dashboard" options.
- **API Resilience**: React hooks (like `useProjects`) are equipped with internal error states. If the backend is unreachable or returns a 500, the UI automatically transitions to the Error Boundary instead of showing empty or broken tables.



## 🧪 Testing

### Backend (Jest — Unit Tests)
The backend includes unit tests for the scoring engine, verifying all formula calculations and edge cases.
```bash
cd cur8-backend
npm test
```

### Frontend (Playwright — E2E Tests)
The frontend includes end-to-end tests covering the dashboard (table rendering, filtering, sorting, navigation) and the project detail page (score cards, back navigation).

> **Prerequisite**: The backend API must be running on port 3000 before running frontend tests. Playwright will auto-start the Next.js dev server on port 3001.

```bash
# Start the backend first (in a separate terminal)
cd cur8-backend && npm run start:dev

# Run E2E tests
cd cur8-frontend
npm run test:e2e

```

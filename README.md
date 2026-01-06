# Activity 7 – Task Management System (Full Stack)
This project is a task management system web application built as a full-stack lab activity.

**Stack Overview**
- **Backend:** NestJS + TypeORM + MySQL + Nodemailer
- **Frontend:** React (Create React App) + Tailwind CSS
- **Auth:** JWT-based authentication + GuestGuard

**Key Features**
- User signup / login
- Create and manage projects
- Assign members and roles
- Create / update / delete tasks
- Project and task dashboards with filtering
- Role-based admin and user experiences

## 1. Requirements
- **Node.js:** v18+ (LTS recommended)
- **npm:** v9+ (comes with Node LTS)
- **Database:** MySQL (or compatible) running locally
- **Terminal:** PowerShell / cmd / Git Bash on Windows
- **Install backend dependencies:**
	- `cd activity7-tms-backend`
	- `npm install`

## 2. Configure Database & Environment
The backend uses TypeORM with MySQL. Create a database, for example:
- **host:** localhost
- **port:** 3306
- **database:** tms_db (or any name you prefer)
- **user:** root (or another user)
- **password:** your password

Configure the connection values in your `.env` (or TypeORM config) to match the project conventions:
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_USERNAME=root`
- `DB_PASSWORD=your_password`
- `DB_NAME=tms_db`
- `JWT_SECRET=your_jwt_secret`

The REST API runs by default on **http://localhost:3000**.

## 3. Frontend Setup (React App)
- **Frontend folder:** activity7-tms-frontend
- **Install dependencies:**
	- `cd activity7-tms-frontend`
	- `npm install`

### 3.2 Configure API URL
Create a `.env` file inside `activity7-tms-frontend` with:
- `REACT_APP_API_URL=http://localhost:3000`

If the file is missing, the frontend falls back to `http://localhost:3000`.

### 3.3 Run the Frontend
- From the project root: `npm run start:frontend`
- Or inside the frontend folder:
	- `cd activity7-tms-frontend`
	- `npm start`

The React app starts on **http://localhost:3000** (or **http://localhost:3001** if 3000 is busy).

## 4. Run Frontend & Backend Together
Root-level helper scripts (package.json):

```
{
	"scripts": {
		"start:frontend": "npm start --prefix activity7-tms-frontend",
		"start:backend": "npm run start:dev --prefix activity7-tms-backend",
		"dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
	}
}
```

**Steps**
- Install root dependencies: `npm install`
- Start both servers: `npm run dev`
- Backend: **http://localhost:3000**
- Frontend: next free port (usually **http://localhost:3001**)

## 5. How the App Works (High-Level Overview)

### Backend (NestJS)
- Exposes REST endpoints for:
	- **Auth:** login, signup, current user (JWT)
	- **Users:** create, list, update, delete
	- **Projects:** create, list, update, archive
	- **Members:** assign users to projects and roles
	- **Tasks:** create, assign, update status, delete
	- **Account:** manage profile settings
- Uses TypeORM entities for User, Project, ProjectMember, Task, and related DTOs.
- Implements role-based guards for admin vs regular user features.

### Frontend (React + Tailwind)
- Single-page experience with dedicated admin and user dashboards.
- Custom hooks/services handle fetching assigned projects, tasks, and analytics.
- Fetch-based services power REST interactions; UI components manage modals, tables, and forms.

**UI Highlights**
- Role-specific navigation sidebars.
- Admin dashboards for project/task metrics and user management.
- User dashboards for assigned tasks, projects, and deadlines.
- Paginated tables, filtering, and detail modals.
- Status management with inline validation feedback.

**Modals Cover**
- Login / signup (auth module)
- Create / edit projects and tasks
- Assign members and update roles
- View and update user profiles
- Confirm destructive actions (delete project/task/user)

This README outlines the project structure, installation steps for both frontend and backend, startup commands, and key functionality end-to-end.

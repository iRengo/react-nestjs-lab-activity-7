# Activity 7 – Task Management System (Full Stack)
This project is a task management system web application built as a full‑stack lab activity.

Backend: NestJS + TypeORM + MySQL + Nodemailer
Frontend: React (Create React App) + Tailwind CSS
Auth: JWT‑based authentication + GuestGuard
Features:
User signup / login
Create and manage projects
Assign members and roles
Create / update / delete tasks
Project and task dashboards with filtering
Role‑based admin and user experiences
1. Requirements
Node.js: v18+ (LTS recommended)
npm: v9+ (comes with Node LTS)
MySQL (or compatible) running locally
A terminal (PowerShell / cmd / Git Bash on Windows)
cd activity7-tms-backend
npm install
2. Configure database & environment
The backend uses TypeORM with MySQL. Make sure you have a database created, for example:

host: localhost
port: 3306
database: tms_db (or any name you prefer)
user: e.g. root
password: your password
Then configure your connection in the TypeORM config / .env file according to how the project is set up (usually something like):

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=tms_db
JWT_SECRET=your_jwt_secret
Adjust the actual variable names to match your typeorm.config.ts and auth configuration.

The REST API will run by default on http://localhost:3000.

3. Frontend Setup (React App)
Frontend folder: activity7-tms-frontend

cd activity7-tms-frontend
npm install
3.2. Configure API URL
The frontend uses an environment variable REACT_APP_API_URL to talk to the backend.

Create a .env file inside activity7-tms-frontend (same level as its package.json) with:

REACT_APP_API_URL=http://localhost:3000
If this file is missing, the frontend falls back to http://localhost:3000 by default.

3.3. Run the frontend
From the project root:

npm run start:frontend
Or inside the frontend folder:

cd activity7-tms-frontend
npm start
The React app will start on http://localhost:3000 or http://localhost:3001 depending on your setup (Create React App will ask to use another port if 3000 is busy).

4. Run Frontend & Backend Together
In the root activity-7 folder there are helper scripts in package.json:

{
	"scripts": {
		"start:frontend": "npm start --prefix activity7-tms-frontend",
		"start:backend": "npm run start:dev --prefix activity7-tms-backend",
		"dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
	}
}
First install the root dependencies (for concurrently):

npm install
Then start both servers with one command:

npm run dev
Backend: runs on http://localhost:3000
Frontend: runs on the next free port (usually http://localhost:3001)
5. How the App Works (High‑Level Description)
Backend (NestJS)
Exposes REST endpoints for:
Auth: login, signup, current user (JWT)
Users: create, list, update, delete
Projects: create, list, update, archive
Members: assign users to projects and roles
Tasks: create, assign, update status, delete
Account: manage profile settings
Uses TypeORM entities for User, Project, ProjectMember, Task, and related DTOs.
Implements role-based guards for admin vs regular user features.
Frontend (React + Tailwind)
React single‑page app with dedicated admin and user dashboards.
Uses custom hooks/services for fetching assigned projects, tasks, and analytics widgets.
Relies on fetch-based services for REST calls and stateful UI components for modals and tables.
UI features:
Role-specific navigation sidebars.
Admin dashboards for project/task metrics and user management.
User dashboards for assigned tasks, projects, and deadlines.
Paginated tables, filtering, and detail modals for tasks and projects.
Status management with real-time validation messages.
Modals for:
Login / signup (auth module)
Create / edit projects and tasks
Assign members and update roles
View and update user profiles
Confirm destructive actions (delete project/task/user)
This README describes the overall structure of the lab, how to install dependencies for both frontend and backend, how to run them together, and what the application does end‑to‑end.

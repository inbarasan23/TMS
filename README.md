# Ticket Management System (TMS)

A comprehensive Ticket Management System for managing maintenance requests (complaints) within an organization. It features role-based access control, a dashboard for statistics, and a full suite of management tools.

## 🚀 Features

-   **Role-Based Access Control (RBAC)**: Distinct roles for Admins, SuperAdmins, Users, and specialized Staff (Plumber, Electrician, etc.).
-   **Dashboard**: Real-time statistics on total, pending, assigned, and completed tickets.
-   **Complaint Management**: Raise, assign, update, and resolve complaints.
-   **Master Data Management**: Manage Departments, Programmes, Blocks, Rooms, Roles, and Users.
-   **Responsive UI**: Modern, dark-themed interface built with React.

## 🛠️ Tech Stack

-   **Frontend**: React.js, React Router, Axios
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose)
-   **Authentication**: JSON Web Token (JWT)

## 📦 Installation & Setup

1.  **Clone the repository**.
2.  **Install Dependencies**:
    ```bash
    # Backend
    cd backend
    npm install

    # Frontend
    cd frontend
    npm install
    ```
3.  **Environment Setup**:
    -   Ensure MongoDB is running.
    -   Verify `.env` in `backend/` has the correct `MONGO_URI`.

4.  **Seed Database**:
    Initialize the database with default roles and users:
    ```bash
    cd backend
    npm run seed
    ```
    *If you face login issues, run:*
    ```bash
    node ensure_all_users.js
    ```

5.  **Run the Application**:
    ```bash
    # Terminal 1: Backend
    cd backend
    npm run dev

    # Terminal 2: Frontend
    cd frontend
    npm start
    ```

## 🔑 Default Credentials

Use these credentials to log in and test the system. **Common password for all seeded accounts: `12345678`**

| Role | Email | Password | Primary function |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | `superadmin@tms.com` | `12345678` | Full System Access (Manage everything) |
| **HOD** | `hod@tms.com` | `12345678` | Raise complaints, View own history |
| **Networking Staff** | `network@tms.com` | `12345678` | View & Resolve assigned networking tasks |
| **Electrician** | `electrician@tms.com` | `12345678` | View & Resolve assigned electrical tasks |
| **Plumber** | `plumber@tms.com` | `12345678` | View & Resolve assigned plumbing tasks |
| **Software Developer** | `developer@tms.com` | `12345678` | View & Resolve software related tasks |

## 📝 API Endpoints

-   **Auth**: `/api/auth/register`, `/api/auth/login`
-   **Master Data**: `/api/master/department`, `/api/master/role`, etc.
-   **Complaints**:
    -   `POST /api/complaints` (Raise Ticket)
    -   `GET /api/complaints` (View Tickets)
    -   `PUT /api/complaints/:id/assign` (Assign Staff)
    -   `PUT /api/complaints/:id/status` (Update Status)

## 📌 Roles & Permissions Logic

-   **SuperAdmin**: Full system control. Can manage all master data (Departments, Programmes, Blocks, Rooms, Roles, Users), view all tickets, assign staff, and delete tickets.
-   **User**: Regular faculty or student. Can raise new complaints and track their own status.
-   **Maintenance Staff**: specialized roles (Plumber, Electrician, Networking Staff, Software Developer, etc.).
    -   Can view only tickets assigned to them.
    -   Can update the status of assigned tickets (e.g., to "In-Progress" or "Completed").
    -   Cannot see tickets raised by others unless assigned.
<!--  -->
Role	Email	Password	Access Level
Super Admin	admin@tms.com	12345678	Full system control
Regular User	hod@tms.com	12345678	Raise/View own tickets
Networking Staff	network@tms.com	12345678	View assigned tickets
Electrician	electrician@tms.com	12345678	View assigned tickets   
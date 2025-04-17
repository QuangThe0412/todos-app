# PT-FINTECH Project

## How to Run the Application

To start the application, use the following commands:

```bash
docker-compose down
docker-compose up --build -d

Application Endpoints
Frontend:
The frontend application is accessible at: http://localhost:3000/

Backend:
The backend API (with Swagger documentation) is accessible at: http://localhost:5245/swagger/index.html

Project Overview
This project consists of:

Frontend: A React application built with TypeScript and served using Nginx.
Backend: A .NET Core API with PostgreSQL as the database.
Database: PostgreSQL is used to store application data.
Features
User Authentication: Users can register, log in, and log out.
Task Management: Users can create, edit, delete, and view tasks.
Filtering and Sorting: Tasks can be filtered by status and sorted by due date.
Role Management: Admins can manage all tasks, while regular users can only manage their own tasks.
Prerequisites
Docker and Docker Compose must be installed on your system.
Notes
Ensure that port 3000 (frontend) and port 5245 (backend) are not being used by other applications.
If you encounter issues, check the logs of the containers:
Troubleshooting
If the frontend shows a 404 Not Found error for routes like /login, ensure that Nginx is configured to redirect all requests to index.html.
If the backend fails to connect to the database, verify the connection string in appsettings.json and ensure the PostgreSQL container is running.
License
This project is for interview purposes and is not licensed for production use.
```

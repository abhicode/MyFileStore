# MyFileStore

A secure and modern web application for managing your files. Upload, view, and download files with user authentication and role-based access. Built with **React**, **Spring Boot**, and **MongoDB**.

<p float="left">
  <img width="1197" height="938" alt="Screenshot from 2025-09-08 22-30-27" src="https://github.com/user-attachments/assets/2dc16031-e483-403d-a3ce-648c10aac294" />

  <img width="1197" height="938" alt="Screenshot from 2025-09-08 22-30-45" src="https://github.com/user-attachments/assets/a0aae915-223a-43a2-baf3-c7961f79bb0a" />

  <img width="1197" height="938" alt="Screenshot from 2025-09-08 22-31-08" src="https://github.com/user-attachments/assets/5f8d8c31-9afb-4565-abdf-ff3e71b87243" />

</p>
---

## Features

- **User Authentication**: JWT-based login, logout, and registration.
- **File Management**:
  - Upload files (text, images, JSON, PDF).
  - View files.
  - Download any file securely.
  - Delete files.
- **Global Notifications**: Snackbar alerts for success, warning, and error messages.
- **Secure Backend**: JWT authentication for protected endpoints.

---

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Spring Boot, Spring Security, JWT
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **API Requests**: Axios

---

## Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Node.js & npm/yarn (for local frontend development)
- Java 21 (for local backend development)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/abhicode/MyFileStore.git
cd MyFileStore
```
2. Create a ```.env``` file in the root:

```bash
JWT_SECRET=mysecretkeymysecretkeymysecretkeymysecretkey
```
3. Start the app with ```docker-compose```:

```bash
docker-compose up --build
```
4. The frontend will be available at ```http://localhost:3000``` and backend at ```http://localhost:8080```





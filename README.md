# MyFileStore

A secure and modern web application for managing your files. Upload, view, and download files with user authentication and role-based access. Built with **React**, **Spring Boot**, and **MongoDB**.

<p float="left">
  <img width="500" height="829" alt="Screenshot from 2025-08-31 03-15-31" src="https://github.com/user-attachments/assets/9caf3ebb-4b01-4c5b-9553-a729d8f069b6" />
  
  <img width="500" height="829" alt="Screenshot from 2025-08-31 03-16-17" src="https://github.com/user-attachments/assets/c3380b62-a257-444a-8842-817ad3704dc0" />
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





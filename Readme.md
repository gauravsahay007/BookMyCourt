
# Sports Booking Application  
**College ID:** IEC2021005  

## Table of Contents
- [Introduction](#introduction)  
- [Project Setup](#project-setup)  
- [Prerequisites](#prerequisites)  
- [How to Run](#how-to-run)  
- [Deployment Links](#deployment-links)  
- [Assumptions and Limitations](#assumptions-and-limitations)  
- [Special Instructions](#special-instructions)  

---

## Introduction  
This is a **sports booking application** designed to streamline booking management for sports facilities. The app supports operations for multiple centres, each offering various sports and courts, with user-friendly functionality for customers and operations teams to view and create bookings.

---

## Project Setup  
To set up the project locally, follow these steps:

### 1. Clone the Repository:
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## Prerequisites  
Make sure you have the following installed on your system:
- **Node.js** (v14 or higher)  
- **NPM** (comes with Node.js)  
- **Git** for version control  
- **MongoDB** (if using locally for backend) or MongoDB Atlas credentials (for cloud database)  

---

## How to Run  

### 1. Start the Backend:
1. Go to the backend folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file with the following content:
   ```bash
   PORT=5000
   DATABASE_URL=<your-mongodb-url>
   JWT_SECRET=<your-jwt-secret>
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

### 2. Start the Frontend:
1. Go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Create a `.env` file with the following content:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

---

## Deployment Links  
- **Frontend:** [Frontend Deployed App](https://bookmycourt-1.onrender.com)  
- **Backend:** [Backend API](https://bookmycourt-lpyh.onrender.com)  

---

## Assumptions and Limitations  
- **Role-based Access:**
  - Users with role `0` are **customers** who can view their schedules.
  - Users with role `1` are **operations team members** who manage bookings and centres.
- **Booking Slot Duration:** Each booking slot is exactly **60 minutes**.
- **One Court per Booking:** A court can only have **one booking per time slot** to prevent conflicts.
- **User Authentication:** Users must **sign in** before accessing the dashboard.
- **MongoDB Database:** The backend uses **MongoDB** for storing data.

---

## Special Instructions  
- Ensure both **frontend and backend servers** are running for the app to function correctly.
- If deploying on Render or any other cloud service, update the **API URLs** in the frontend `.env` file to match the deployed backend.
- Use **Postman** or **Insomnia** for testing backend routes if required.

---

### **How to Use:**
1. Save this content as **`README.md`** in the **root directory** of your project.  
2. Replace placeholders like `<repository-url>`, `<your-mongodb-url>`, and `<your-jwt-secret>` with actual values.  
3. Update the **deployment links** with the correct URLs of your deployed frontend and backend services.

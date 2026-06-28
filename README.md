# TaskTracker 📝

TaskTracker is a modern, high-performance web application designed to help you capture, organize, and tackle your to-dos efficiently. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a beautiful UI, customizable tags and lists, and robust task management views.

**🚀 Live Demo:** [https://tasktracker-ckt6.onrender.com](https://tasktracker-ckt6.onrender.com)

<div align="center">
  <img src="./screenshots/Screenshot%202026-06-28%20203057.png" alt="TaskTracker Dashboard" width="600" />
</div>

## Features ✨
- **Smart Views:** Organise your tasks into "Today", "Upcoming", or view them all on a beautiful, interactive **Calendar** or **Sticky Wall**.
- **Custom Metadata:** Create unlimited custom Tags (e.g. `urgent`, `low-priority`) and Lists (e.g. `Personal`, `Work`) to categorize tasks exactly how you want.
- **Modern Aesthetic:** A sleek, minimal Light Mode aesthetic designed for maximum focus, using carefully chosen typography and a distraction-free layout.
- **Security & Accounts:** Full JWT-based authentication system with encrypted passwords and individual user profiles.
- **Drag & Drop:** Effortlessly manage your task status by dragging them across columns on the Sticky Wall.

## Tech Stack 🛠️

**Frontend:**
- React (Vite)
- React Router DOM
- CSS Custom Properties (Variables)
- Context API for global state management

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for secure password hashing

## Installation & Setup 🚀

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tasktracker.git
   cd tasktracker
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tasktracker
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```
   Run the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Open the App:**
   Visit `http://localhost:5173` in your browser.

## API Documentation 📡

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in a user |
| `GET` | `/api/tasks` | Get all tasks for the logged in user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## License 📜
This project is open-source and available under the [MIT License](LICENSE).

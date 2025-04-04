# Book Club Frontend
Follow these steps to set up and run the Book Club frontend and backend:

### Prerequisites
1. **Node.js**: Ensure Node.js is installed on your system.
2. **MongoDB**: Make sure MongoDB is installed and running locally.

### Running the Application
1. **Start the Backend Server First**:
   ```bash
   npm run server
   ```
   The backend will run on `http://localhost:5001`.

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will run on a different port (e.g., `http://localhost:5002`).

### If Port used by other service
If you need to run the backend on a different port:
1. Update the `PORT` variable in the `.env` file.
2. Restart the backend server.


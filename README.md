# Countries Explorer with Authentication

A full-stack application that allows users to explore countries around the world with user authentication features.

## Features

- **User Authentication**: Register, login, and protected routes
- **Country Data**: View detailed information about countries
- **Search & Filter**: Search countries by name, filter by region, population, etc.
- **Favorites**: Save your favorite countries
- **Compare Mode**: Compare different countries side by side
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React.js
- React Router
- TailwindCSS
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB installation

### Installation

1. Clone the repository
```
git clone <repository-url>
cd project-folder
```

2. Install dependencies for the backend
```
cd backend
npm install
```

3. Install dependencies for the frontend
```
cd ../my-project
npm install
```

4. Configure environment variables
   - Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd ../my-project
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Log in a user
- `GET /api/users/profile` - Get user profile (protected)

## License
MIT 
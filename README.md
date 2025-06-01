# Volunteer Hub

A platform for connecting volunteers with opportunities and events.

## Project Structure

```
internship_PROJECT/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   └── src/
│       ├── api/             # API services
│       ├── assets/          # Images and other assets
│       └── Components/      # React components
│           ├── Auth/        # Authentication components
│           ├── Events/      # Event components
│           ├── Feedback/    # Feedback components
│           ├── Forms/       # Form components
│           ├── HomePage/    # Home page components
│           ├── Navbar/      # Navigation components
│           └── Opportunities/ # Opportunity components
│
└── backend/                 # Express backend
    ├── public/              # Static files and uploads
    └── src/
        ├── config/          # Configuration files
        ├── controllers/     # Route controllers
        ├── middleware/      # Custom middleware
        ├── models/          # Mongoose models
        └── routes/          # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

## Features

- User authentication (login/signup)
- Browse volunteer opportunities
- Browse volunteer events
- Create new opportunities and events
- View testimonials from volunteers
- Responsive design for mobile and desktop

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get single opportunity
- `POST /api/opportunities` - Create new opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/random` - Get random testimonials
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
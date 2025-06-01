# Volunteer Hub Backend API

This is the backend API for the Volunteer Hub application, providing endpoints for authentication, events, opportunities, and testimonials.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/volunteer-hub
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/logout` - Logout user (protected)

### Events

- `GET /api/events` - Get all events (with pagination)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Opportunities

- `GET /api/opportunities` - Get all opportunities (with pagination)
- `GET /api/opportunities/:id` - Get single opportunity
- `POST /api/opportunities` - Create new opportunity (protected)
- `PUT /api/opportunities/:id` - Update opportunity (protected)
- `DELETE /api/opportunities/:id` - Delete opportunity (protected)

### Testimonials

- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/random` - Get random testimonials
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create new testimonial (protected)
- `PUT /api/testimonials/:id` - Update testimonial (protected)
- `DELETE /api/testimonials/:id` - Delete testimonial (protected)

## Models

- User
- Event
- Opportunity
- Testimonial

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token in the Authorization header:

```
Authorization: Bearer <token>
```
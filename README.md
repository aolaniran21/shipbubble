# Shipbubble

## Setup

1. Clone the repository:
   git clone https://github.com/aolaniran21/shipbubble.git
   cd shipbubble
   npm install
2. Create environment variables in a `.env` file:
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=bus_ticketing
   JWT_SECRET=your_jwt_secret

### Docker Setup

1. Start the application and the database using Docker Compose:
   docker-compose up

### Manual Setup

1. Seed data:
   npm run seed

2. Build:
   npm run build

3. Run Application:

   - Production: npm run prod
   - Development: npm run dev

   The application will be available at http://localhost:3000.

## Testing

1. To run the tests, use the following command:
   npm run test

2. API Documentation:
   [API Documentation](https://documenter.getpostman.com/view/11862710/2sA3kRJPPU)

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

1. Edit `docker-compose.yml` file

```
version: '3.8'

services:
    db:
        image: mysql:8.0
        environment:
            MYSQL_ROOT_PASSWORD: root_password # Change this to your root database password
            MYSQL_DATABASE: shipbubble

        ports:
            - "3307:3306"
        volumes:
            - db_data:/var/lib/mysql

    app:
        build: .
        environment:
            - DB_HOST=db
            - DB_USER: root
            - DB_PASSWORD: root_password # Change this to your root database password
            - JWT_SECRET=your_jwt_secret
        ports:
            - "3000:3000"
        depends_on:
            - db

    volumes:
        db_data:
```

#### Build the Docker Image

1. docker build -t shipbubble .

#### Start service

1. docker-compose up

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

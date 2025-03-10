# Book Borrowing System

This is a book borrowing system built with React for the frontend, Node.js with Express for the backend, Prisma as the ORM, and Docker for containerization.

## Features
- User authentication and authorization
- Book catalog with search functionality
- Borrow and return books
- Admin panel for managing books and users
- Dockerized setup for easy deployment

## Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)


### Start the Application with Docker
```sh
docker-compose up --build -d
```
This will start the frontend, backend, and database containers.

## Running Migrations
After the containers are up, run the following command to migrate the database:
```sh
docker exec -it my_service_web sh -c "npm run seed" 
```

## Accessing the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Stopping the Application
```sh
docker-compose down
```



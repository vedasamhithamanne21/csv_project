# CSV Project

This project is a TypeScript-based application for processing CSV files.

## Features

- Load CSV files
- Parse and validate CSV data
- Export processed data

## Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/vedasamhithamanne21/csv_project.git
    ```
2. Navigate to the project directory:
    ```sh
    cd csv_project
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Run the application:
    ```sh
    npm start
    ```
2. Follow the on-screen instructions to process your CSV files.

## Scripts

- `dev`: Run the development server
- `build`: Create a production build
- `start`: Start the production server
- `lint`: Run ESLint

- ## Docker

- These Docker files will create a containerized environment for your Scientific Data Viewer project. The `Dockerfile` sets up the Node.js application, while the `docker-compose.yml` file orchestrates both the app and the PostgreSQL database.

 

Here's a brief explanation of what each file does:

 

1. `Dockerfile`: This file defines how to build the Docker image for your Node.js application. It starts from a Node.js base image, copies your application files, installs dependencies, generates the Prisma client, builds the Next.js app, and sets up the command to start the application.
2. `docker-compose.yml`: This file defines two services:

 

1. `app`: Your Node.js application, built from the Dockerfile in the current directory.
2. `db`: A PostgreSQL database using the official PostgreSQL Docker image.

 

 

It also sets up environment variables, port mapping, and a volume for persisting database data.

 

 

3. `.env`: This file is updated to use the database URL that will work within the Docker network.

 

 

To use this Docker setup:

 

1. Ensure you have Docker and Docker Compose installed on your system.
2. Place these files in your project root directory.
3. Run `docker-compose up -d --build` to build and start the containers.
4. Access your application at `http://localhost:3000`.

 

 

This setup provides a consistent and isolated environment for both development and deployment, making it easier to manage dependencies and ensure your application runs the same way across different systems.

**Languages**
TypeScript
Tools and Frameworks
Next.js
React
Tailwind CSS
ESLint
PostCSS
Chart.js
CSV-Parse
PostgreSQL (pg library)
**Development Dependencies**
TypeScript
@types/node
@types/react
@types/react-dom
@types/pg
**Key Features**
Load, parse, and validate CSV files
Export processed data.

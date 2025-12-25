# NEBS IT - Notice Management (Client)

## Project Overview

This is the frontend client for the NEBS IT Notice Management platform. It provides a user interface for creating, viewing, and managing notices. The application is built as a single-page application using React.

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API Communication**: Fetch API

## Installation

To run this project locally, follow these steps:

1.  Navigate to the client directory:
    ```bash
    cd nebs-it-notice-client
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `nebs-it-notice-client` directory and add the environment variables (see below).

4.  Start the local development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Environment Variables

This project requires the following environment variable to be set in a `.env` file in the root of the client directory:

-   `VITE_API_BASE_URL`: The base URL for the backend API. For local development, this should point to your local server's URL (e.g., `http://localhost:3000/api`). For production, this should point to your deployed Vercel server URL.

**Example `.env` file:**

```
VITE_API_BASE_URL=http://localhost:3000/api
```
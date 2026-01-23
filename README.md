## To run application locally

### 1. Install dependencies

Install root dependencies:

```bash
npm install
```

Install dependencies for both client and server:

```bash
npm run install-all
```

### 2. Create .env file

Create a `.env` file in the `server` directory and add a variable named `MONGODB_URI`. For example:

```bash
MONGODB_URI=mongodb://localhost:27017/superhero-db
```

### 3. Start the application

Start the application with the `npm start` command.

**Note:** Ensure that Docker Desktop is installed and running on your system.

## For testing

Run tests using the `npm run test-all` command in the root directory or `npm test` within the individual project folders.

## To run application locally

### 1. Install dependencies

Install dependencies for the entire project:

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

## For testing

Run tests using the `test-all` command in the root directory or `npm test` within the individual project folders.

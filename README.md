# Trading Journal

A trading journal application with a Node.js/Express backend and a React frontend.

This README currently covers backend setup only. Frontend setup instructions will be added after the frontend is complete.

## Backend Setup

### Requirements

- Node.js and npm
- MongoDB running locally
- Git

You can verify Node.js and npm are installed with:

```bash
node -v
npm -v
```

## Run Backend Locally

### 1. Clone the Repository

```bash
git clone https://github.com/dejatinrana/trading-journal.git
cd trading-journal
```

### 2. Go to the Backend Folder

```bash
cd backend
```

### 3. Install Dependencies

The backend packages are listed in `backend/requirement.txt` for quick reference:

```text
bcryptjs@^3.0.3
cors@^2.8.6
dotenv@^17.4.2
express@^5.2.1
jsonwebtoken@^9.0.3
mongoose@^9.6.2
nodemon@^3.1.14
```

Install them with npm from the `backend` folder:

```bash
npm install
```

`npm install` reads `backend/package.json` and `backend/package-lock.json`, then downloads the required packages into `backend/node_modules`.

### 4. Create Environment File

Copy the example environment file.

Mac/Linux:

```bash
cp .env.example .env
```

Windows Command Prompt:

```cmd
copy .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Your `backend/.env` should contain:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/trading-journal
JWT_SECRET=my_super_secret_trading_journal_key
```

For your own local setup, you can change `JWT_SECRET` to any long private string.

### 5. Start MongoDB

Make sure MongoDB is running before starting the backend.

Mac with Homebrew:

```bash
brew services start mongodb-community
```

Windows:

Start MongoDB from the Windows Services app, or run MongoDB using the method you used when installing it.

If MongoDB is running correctly, the backend will connect to:

```text
mongodb://127.0.0.1:27017/trading-journal
```

### 6. Start the Backend Server

For development:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

The backend runs at:

```text
http://127.0.0.1:5001
```

Open this URL in your browser:

```text
http://127.0.0.1:5001
```

You should see:

```text
Trading Journal Backend Running
```

## Backend API Base Paths

- Auth routes: `http://127.0.0.1:5001/api/auth`
- Trade routes: `http://127.0.0.1:5001/api/trades`

## Notes

- Do not commit your real `.env` file.
- Keep production secrets private.
- Frontend setup instructions will be added later.

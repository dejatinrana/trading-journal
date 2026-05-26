# Trading Journal

A private trading journal web app for forward testing crypto and forex trades.

The app has:

- Backend: Node.js, Express, MongoDB, Mongoose, JWT auth
- Frontend: React, Vite, Tailwind CSS, Axios, React Router DOM, Recharts, Lucide React

## Requirements

Install these before running the project:

- Git
- Node.js and npm
- MongoDB running locally

Check Node.js and npm:

```bash
node -v
npm -v
```

## Clone the Project

Mac:

```bash
git clone https://github.com/dejatinrana/trading-journal.git
cd trading-journal
```

Windows Command Prompt:

```cmd
git clone https://github.com/dejatinrana/trading-journal.git
cd trading-journal
```

Windows PowerShell:

```powershell
git clone https://github.com/dejatinrana/trading-journal.git
cd trading-journal
```

## Backend Setup

### Backend Packages

Backend package reference is available in:

```text
backend/requirement.txt
```

Packages:

```text
bcryptjs@^3.0.3
cors@^2.8.6
dotenv@^17.4.2
express@^5.2.1
jsonwebtoken@^9.0.3
mongoose@^9.6.2
nodemon@^3.1.14
```

### Install Backend Dependencies

Mac:

```bash
cd backend
npm install
```

Windows Command Prompt:

```cmd
cd backend
npm install
```

Windows PowerShell:

```powershell
cd backend
npm install
```

`npm install` reads `backend/package.json` and `backend/package-lock.json`, then downloads packages into `backend/node_modules`.

### Create Backend Environment File

From inside the `backend` folder, copy `.env.example` to `.env`.

Mac:

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

For your own local system, you can change `JWT_SECRET` to any long private string.

### Start MongoDB

Make sure MongoDB is running before starting the backend.

Mac with Homebrew:

```bash
brew services start mongodb-community
```

Windows:

Start MongoDB from the Windows Services app, or run MongoDB using the method you used when installing it.

The backend connects to:

```text
mongodb://127.0.0.1:27017/trading-journal
```

### Start Backend Server

From inside the `backend` folder:

Mac:

```bash
npm run dev
```

Windows Command Prompt:

```cmd
npm run dev
```

Windows PowerShell:

```powershell
npm run dev
```

Backend URL:

```text
http://127.0.0.1:5001
```

Open this URL in your browser. You should see:

```text
Trading Journal Backend Running
```

## Frontend Setup

Open a second terminal window. Keep the backend running in the first terminal.

### Frontend Packages

Frontend package reference is available in:

```text
frontend/requirement.txt
```

Main frontend packages:

```text
axios@^1.16.1
lucide-react@^1.16.0
react@^19.2.6
react-dom@^19.2.6
react-router-dom@^7.15.1
recharts@^3.8.1
```

### Install Frontend Dependencies

From the project root:

Mac:

```bash
cd frontend
npm install
```

Windows Command Prompt:

```cmd
cd frontend
npm install
```

Windows PowerShell:

```powershell
cd frontend
npm install
```

`npm install` reads `frontend/package.json` and `frontend/package-lock.json`, then downloads packages into `frontend/node_modules`.

### Start Frontend Server

From inside the `frontend` folder:

Mac:

```bash
npm run dev
```

Windows Command Prompt:

```cmd
npm run dev
```

Windows PowerShell:

```powershell
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

Open this URL in your browser to use the Trading Journal app.

## Running the Full Project Locally

Use two terminal windows:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://127.0.0.1:5173
```

## Backend API Base Paths

- Auth routes: `http://127.0.0.1:5001/api/auth`
- Trade routes: `http://127.0.0.1:5001/api/trades`

Protected trade routes require:

```text
Authorization: Bearer <token>
```

## Notes

- Do not commit your real `.env` file.
- Keep production secrets private.
- `requirement.txt` files are human-readable references.
- Node.js installs should be done with `npm install`, using each folder's `package.json` and `package-lock.json`.

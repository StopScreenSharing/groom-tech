# Groom Tech

## Overview
GroomTech is a small full stack project designed for groomers to keep track of their grooming appointments. Add owners, dogs, and fill out the application form to log your upcoming appointments.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Flask

## Features
- User registration and authentication
- Add owners and dogs for appointments
- Real-time appointment scheduling


## Installation
To get a copy of the project up and running on your local machine for development and testing purposes, follow these steps:

### Prerequisites
- Node.js
- npm or yarn

### Installation
Clone the repository:
```bash
git clone https://github.com/StopScreenSharing/groom-tech.git
cd groom-tech
```

Install dependencies:
```bash
npm install
```

## Configuration
Create a `.env` file if your project uses environment variables:
```bash
cp .env.example .env
```

Example environment variables (adjust to your project):
- PORT=5555 — port the app runs on
- NODE_ENV=development

## Usage
Start the app in development:
```bash
npm start

```

Open the web UI at http://localhost:5555 (if applicable), or run the CLI command:
```bash
python app.py
```

Adjust commands to match your project's scripts in package.json.

## Development
Recommended workflow:
1. Fork and clone the repo
2. Create a feature branch: `git checkout -b feat/add-import`
3. Install dependencies and run the dev server

## Testing
Run tests:
```bash
npm test
```
# [![codecov](https://codecov.io/gh/Scooty-Doo/scooty-doo-frontend/graph/badge.svg?token=4SNOPRGXQ3)](https://codecov.io/gh/Scooty-Doo/scooty-doo-frontend)

# Scooty-Doo Frontend
Frontend for the Scooty Doo web application.

## Table of Contents
- [Installation](#installation)
- [Startup](#startup)
- [Run Tests](#run-tests)
- [Development Workflow](#development-workflow)
- [Docker](#docker)

---

## Installation
To install the necessary dependencies, run the following command:

```bash
npm install
```

---

## Startup
To start the development server, use:

```bash
npm start
```

---

## Run Tests
Run tests in active mode:

```bash
npm run test
```

Run tests with code coverage:

```bash
npm run coverage
```

---

## Development Workflow
1. Create a new branch for your work:

```bash
git checkout -b branchname
```

2. Make changes and ensure they are small, manageable commits.
3. Commit your changes with descriptive messages:

```bash
git commit -m "feat: add new feature"
```

4. Push your branch and open a pull request.

---

## Docker
This react app can be run with docker images. There are two seperate ones, a production one and a development one.

### Development
To run the development container:

```bash
docker compose up webclient-dev
```

### Production
First, build the site:

```bash
npm run build
```

Then, run the production container:

```bash
docker compose up webclient-prod
```

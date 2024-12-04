# scooty-doo-frontend
Frontend for the Scooty Doo web application

## Docker

This react app can be run with docker images. There are two seperate ones, a production one and a development one.

To run the development one use:
```
docker compose up webclient-dev
```

To run the production one, you first need to build the site, then run the container:
```
npm run build
docker compose up webclient-prod
```

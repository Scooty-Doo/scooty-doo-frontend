# Dockerfile for production
FROM node:22

WORKDIR /app

COPY ./build /app

RUN npm install -g serve

CMD ["serve"]

FROM node:18
WORKDIR /app
RUN apt-get update && apt-get install -y default-mysql-client
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

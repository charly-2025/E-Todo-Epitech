FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 3001
CMD ["/wait-for-it.sh", "etodo:3306", "--", "npm", "start"]

FROM node:18-alpine

EXPOSE 3000
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["npx prisma migrate deploy", "npm", "run", "start"]
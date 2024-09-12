FROM node:18-alpine

EXPOSE 3000
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npm run prisma validate

CMD ["npm", "run", "start"]
FROM node:18-alpine

#EXPOSE 3000
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

RUN npx prisma migrate deploy
RUN npx prisma studio

CMD ["npm", "run", "start"]

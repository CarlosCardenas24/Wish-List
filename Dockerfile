FROM node:18-alpine

EXPOSE 3000
WORKDIR /app
COPY . .

ENV DATABASE_URL="postgres://u8t8q0h5auu0g1:p0441af7e25ecaeea9a16e1ad401d2e8ef6ec9646ba439dc0904b98006fd8397d@c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/db7bh5qi30djf9"
RUN npm install
RUN npm run build
RUN npm run prisma validate

CMD ["npm", "run", "start"]
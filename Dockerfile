FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
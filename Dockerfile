FROM --platform=linux/amd64 node:20-slim

RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

# Run migrations at startup
CMD npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && npm start
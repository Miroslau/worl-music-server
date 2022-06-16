FROM node:16.14.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

RUN npm run build

COPY ./dist ./dist
COPY . /app

CMD ["node", "dist/main.js"]

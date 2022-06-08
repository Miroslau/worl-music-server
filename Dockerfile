FROM node:16.14.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./dist ./dist
COPY . /app

CMD ["npm", "run", "start:dev"]

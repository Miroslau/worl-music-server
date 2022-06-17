FROM node:16.14.0
RUN mkdir -p /app
RUN mkdir -p /dist
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
COPY ./dist ./dist
RUN npm run build
CMD ["node", "dist/main.js"]

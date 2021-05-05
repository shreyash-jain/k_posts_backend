FROM node:alpine

WORKDIR /app
ENV CI=true
COPY package.json ./
RUN npm config set ca=""

RUN npm set strict-ssl false
RUN npm install

COPY ./ ./

CMD ["npm","start"]



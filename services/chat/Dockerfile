FROM node:20-alpine

#install OpenSSl
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

#Install dependencies
RUN npm install

COPY . .
#Client prisma
RUN npx prisma generate 

RUN chmod +x entrypoint.sh

EXPOSE 3004

#Execute
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["node", "src/index.js"]

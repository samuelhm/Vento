FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173
CMD ["/bin/sh", "-c", "KEY_FILE=''; if [ -f /run/secrets/googleapi.txt ]; then KEY_FILE=/run/secrets/googleapi.txt; elif [ -f /run/secrets/googleapi.txt/googleapi.txt ]; then KEY_FILE=/run/secrets/googleapi.txt/googleapi.txt; fi; if [ -n \"$KEY_FILE\" ]; then export VITE_GOOGLE_MAPS_API_KEY=\"$(tr -d '\\r\\n' < \"$KEY_FILE\")\"; if [ -n \"$VITE_GOOGLE_MAPS_API_KEY\" ]; then echo \"Loaded Google Maps API key from $KEY_FILE\"; else echo \"Google Maps API key file is empty ($KEY_FILE). Starting without key.\"; fi; else echo 'Google Maps API key not found. Starting without key.'; fi; npm install && npm run dev"]
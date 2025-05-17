# Use the latest LTS version of Node.js
FROM node:22-alpine AS build
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of your application files
COPY . .
# Expose the port your app runs on
EXPOSE 3000
# Define the command to run your app
RUN npm run build

FROM nginx:alpine AS production

# Copy the build files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose the port that Nginx will run on
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
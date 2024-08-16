FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the application port (assuming your app runs on port 3000)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]s

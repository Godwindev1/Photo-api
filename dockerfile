FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
# CMD ["sh"]
CMD ["node", "Program.js"]
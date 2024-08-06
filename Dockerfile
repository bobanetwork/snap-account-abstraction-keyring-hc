# Use an official Node.js runtime as the base image
FROM node:18.18

# Set the working directory in the container
WORKDIR /app

COPY . .

# Install dependencies
RUN yarn

# Expose the port the app runs onyesy
EXPOSE 8000
EXPOSE 8080

# Command to run the application
CMD ["yarn", "start"]

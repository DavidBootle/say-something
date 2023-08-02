# davidbootle/saysomething

# use base node image
FROM node

# Create app directory and use it as the working directory
WORKDIR /usr/src/app

# Install app dependencies
# copy package.json and package-lock.json
# then run a clean install of dependencies
COPY package*.json ./
RUN npm ci

# Expose app port
EXPOSE 4173

# Copy app source code into container
COPY . .

# Build app
RUN npm run build

# Start server
CMD ["npm", "run", "preview"]
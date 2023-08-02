# davidbootle/saysomethingbackend

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
EXPOSE 5200

# Copy app source code into container
COPY . .

# move to the dist folder
WORKDIR /usr/src/app

# Start server
CMD ["npm", "run", "dev"]
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

# install static-server
RUN npm install -g static-server

# Expose app port
EXPOSE 4173

# Copy app source code into container
COPY . .

# Build app
RUN npm run build

# move to the dist folder
WORKDIR /usr/src/app/dist

# Start server
CMD ["static-server", "-p", "4173"]
# FROM node:18-alpine

# WORKDIR /usr/app

# COPY package.json /usr/app/

# RUN npm install

# COPY ./ /usr/app/

# RUN npm run build

# EXPOSE 4500

# CMD [ "npm","start" ]

# --- Stage 1: Build the application ---
FROM node:22-alpine AS builder

WORKDIR /usr/app

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and run the build script
COPY . .
RUN npm run build


# --- Stage 2: Run in production ---
FROM node:22-alpine

WORKDIR /usr/app

# Copy package files and install only production dependencies
COPY package*.json ./
# RUN npm install --production
RUN npm install --omit=dev

# Copy the compiled build output from the builder stage
# (Note: change "dist" to "build" if your bundler outputs to a build folder)
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/bin ./bin
COPY --from=builder /usr/app/views ./views
COPY --from=builder /usr/app/public ./public

EXPOSE 4500

CMD ["npm", "start"]
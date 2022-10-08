# Build container
FROM node:12-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install npm dependancies
RUN npm install && npm audit fix

# Remove other user permissions
RUN chmod -R o-rwx .

# Pull build into a second stage deploy alpine container
FROM node:12-alpine

LABEL maintainer="Yasitha Bogamuwa"

# Install packages
RUN apk add --no-cache ca-certificates tzdata curl

COPY --from=builder --chown=1001:1001 /usr/src/app /usr/src/app

USER 1001

WORKDIR /usr/src/app

CMD ["npm", "start"]
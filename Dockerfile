FROM node:12.14-alpine

# Setting working directory. All the path will be relative to WORKDIR
ENV APP_HOME /usr/src/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# Copy over our application code

# Installing dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copying source files
COPY . $APP_HOME

ENV HOST 0.0.0.0
EXPOSE 3000
# Running the app
CMD [ "yarn", "run", "dev"]

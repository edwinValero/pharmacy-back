# ✅ Best Practice
# 1. Base target it only includes base image and workdir.
# use deterministic docker base image tags, instead of generic image aliases
# use SHA hashes or specific image version tags.
FROM node:18-alpine AS base
LABEL Description="Dockerfile Pharmacy"
WORKDIR "/app"

# 2. dependencies, it includes package.json in copy to include in docker cache for CI speed up.
# Install dependencies, is important to do it inside the docker image
# because some dependencies are based on the os they are installed.
# NPMRC as and ARG to install private dependencies.
FROM base AS deps
COPY package.json /app/
COPY package-lock.json /app/
RUN  npm ci

# 3. Install Deps for Production, based on the previous step it will use the devDependencies, to build the project
# with any build tool you have
FROM deps AS prodbase
COPY . /app/
RUN npm ci --only=production

# 4. Install Deps, use it for development to obtain the dist folder
FROM deps AS dev
COPY . /app/
RUN npm run build

# 5. Optimize the image, use only dev dependencies, copy just the required files
# to the docker image, avoid adding the src code, just the build one
# avoid adding test folder, test results, etc.
FROM prodbase AS prod
COPY --from=dev --chown=node /app/dist/ /app/dist/
COPY --from=prodbase --chown=node /app/node_modules/ /app/node_modules/
USER node
CMD ["npm", "run", "start:prod"]
EXPOSE 3000

# Bright Network Job Recommender - Interview Task

A simple job recommendation application designed to be extensible and easy to use. To get started with running it, follow the instructions below.

## Getting started

Ensure you are running the solution on the correct Node version (v22.14.0) by running

```sh
nvm install && nvm use
```

If you do not have nvm installed, ensure your `node --version` returns v22.X.X or install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) using instructions for your OS. Other node versions may work but that's not guaranteed.

Next, run

```sh
npm ci
```

to install the necessary node modules (as defined in the package-lock.json file)

(Note, a .env file is committed in the repo as it doesn't contain anything secret at the moment.)

Then, transpile the TypeScript by running:

```sh
npm run build
```

Finally, to run the application, run

```sh
npm start
```

Alternatively, to run nodemon so you can have hot-reloading while developing, you can run

```sh
npm run dev
```

This will run the application in watch mode and re-run it when you make changes.

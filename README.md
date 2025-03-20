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

# Testing

There are some basic unit tests provided that validate the functionality of the 3 matchers and the 3 services. They mostly pass however as will be mentioned below, due to limitations of the algorithms some tests fail.

To run the tests, run

```sh
npm test
```

Alternatively, to run it in watch mode, you can run

```sh
npm run test:watch
```

# Acknowledgement of the problem

# Architecture

I have decided to layout the application such that it would be easy to extend, keeping the logic separated into different services. Being mindful of the request to not over complicate things and have 10 different modules, I tried to keep the solution simple yet still forward thinking, as if this was a real development task.

- Services
  - Jobs service
    - This service is responsible for fetching jobs from the config defined JOBS_ENDPOINT
  - Users service
    - This service is responsible for fetching users from the config defined USERS_ENDPOINT
  - Recommendation Service
    - Instantiated by passing it a list of matchers, where the matchers are different functions used to calculate the final relevance score of a job for a give user
    - The matchers can be changed out by passing a different list of matchers.
    - The service contains a single function called 'recommend' which given a user and a list of jobs is able to return the most relevant jobs for a user by using the matchers the service was instantiated with to calculate a final score.
    - The service is also instantiated with a cutoff value which is used to throw away jobs whos score does not reach a certain value.
    - The return value of the recommend function is an array of jobs with their scores against them
- Matchers
  - Matchers are functions that determine, based on a certain criteria, if a user's bio matches a given job.
  - They have four main properties
    - The **name** of the matcher (mostly used for debugging purposes)
    - **match** function - this function executes the logic of the matching
    - **isRelevant** function - this function determines if this matcher should be used given a user's bio. I felt this was important as some users' bios do not limit them to a given location for example. For example, they may want to work anywhere and so a location matcher's score should not be taken into account in the final score as it may skew the result.
    - Initially, I have also introduced '**priority**' for which the thinking was that you could give a higher weight to a certain matcher should you wish. I haven't utilised this however.
  - **Experience Level Matcher**
    - This matcher parses the job title and the users bio and checks for the occurrence of any relevant experience keywords
    - Based on the existence of these keywords in the job and the user, the matcher returns either 0 or 1.
    - It uses a really basic comparison algorithm and a predefined array of experience keywords
  - **Location Matcher**
    - The location matcher checks the users bio for location keywords and then determines if a job's location is relevant for a user
    - It works similarly to the experience level matcher in that it uses a predefined list of keywords, so it isn't the most clever solution
    - It checks for positive, negative and relocation keywords where positive keywords are such that would mean a user is looking for a job in a specific location, negative keywords are ones where a job with a certain location should be excluded and finally relocating keywords are ones to try and account for users moving to an area.
  - **Role Matcher**
    - This matcher is the last once I have implemented and I decided to play around with a little bit more clever algorithms
    - This matcher calculates a similarity score using the Sorenson-Dice coefficient algorithm. It is one of the algorithms I found on the internet for similarity checks and I found a small util to help with this.
    - Originally, I considered using fuzzy search as I used it before but thought it's a bit overkill for the task at hand and the time constraint
    - The logic of the matcher is to loop through each keyword of the user's bio as well as the job title and find the highest similarity keyword, returning the number.
    - Again, this matcher is pretty basic and falls short in many edge cases but it's a good base
  - **Index file**
    - The main entry point of the application
    - It instantiates a user service, a job service and the recommendation service with the three matchers available
    - Then for every user, it calls the **recommend** function to get the list of recommended jobs for them
    - Thought about making a CLI tool or a small Reach frontend but given the request to not over complicate the solution, I decided against this

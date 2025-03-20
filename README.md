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

The problem of matching users with jobs is, as I have discovered, quite complex. There's a lot of nuance behind human speech and idioms, negation and the true intent behind someones words. My solution is pretty basic, though I have enjoyed tweaking the parameters to at least have the happy path working well (the jobs and users provided from the interview task json files). There are a lot of edge cases and having a pre-defined list of hardcoded words to look for is not a very flexible solution. I have written tests as I went along to help create the matchers and to think about some of the uses cases. Some of these tests I have left as failing in order to demonstrate some of the scenarios where my solution falls short. Hopefully my solution is appreciated.

# Architecture

I have decided to layout the application such that it would be easy to extend, keeping the logic separated into different services. Being mindful of the request to not over complicate things and have 10 different modules, I tried to keep the solution simple yet still forward thinking, as if this was a real development task. I structured the solution as I would a typical project, separating concerns and making the recommendation service closed for modification but open to extension. I setup the basics I would start with in all projects, including eslint, prettier and jest tests.

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

# Shortcomings

Some of the problems with the solutions are:

- The Location Matcher used alone on a bio that doesn’t specify a location will mean that matcher is not relevant to the user and therefore no jobs will be returned when perhaps all jobs should be
- Location matcher doesn’t use similarity index but just uses plain old includes and looks for exact matches only
- Location matcher will work as long as the location after the location keyword is at the end of the bio. It currently picks the rest of the string after the matched location keyword instead of picking the next city, it also won’t work for scenarios like “outside of the big city of London”
- The values for the cutoff and priorities for the matcher are ambiguous. It is unclear if the values I set are over-fitted to the existing dataset. Should the cutoff be 0.7 or 0.6? Will that throw away potential jobs that would be relevant due to incorrect configuration?
- Experience Level matcher doesn't use similarity index either so typos will mean jobs are missed.
- I'm sure there's more I haven't yet thought of!

# Further improvements and suggestions

This has been an interesting problem and has highlighted the difficulty in free text parsing to me. Looking at the delivered solution, in retrospect, these are some of the things I would consider if given more time or the solution needed to be more robust:

- Parse the jobs up-front to create properties for them which could make the comparison more structured. Do the same for users and then the matchers can be more specific, targeting only a certain property on the user and job objects. Creating structured data from non structured data would aid in the recommendation. This is likely what various CV parsing tools do. Likewise for job spec parsers.
- Use natural language processing and AI tools to parse non-structured free text bios to aid in the extraction of key fields from both job specs as well as user bios. There are a lot of edge cases that need to be handled in a scenario like this: typos, things not appearing in the expected order, meaning of the text and the sentiment behind it. All of these could be taken into account with more robust matchers.
- The matching is done synchronously at the moment. With more complex matching algorithms this would not be suitable and instead async operations, perhaps using cron jobs, cloud scheduled tasks or even a queue system would aid in the user experience
- Of course, a UI would be great for a solution like this. I decided not to do one here (other than the logging output) however it wouldn't have been too difficult to serve up the recommendations and the jobs/users as an API and have a frontend consume it
- The solution could in the future be more data-driven, such that the matching words or properties matched are defined in a database or collection and these can be edited on the fly allowing run time modification of the matching algorithms, perhaps based on user preferences or an admin site updating and tweaking parameters.

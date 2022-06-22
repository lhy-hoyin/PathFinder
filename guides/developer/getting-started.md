# Getting Started

## What you need
1. Your preferred IDE or text editor
1. [Node.js](https://nodejs.org/en/download/) installed
1. [Supabase](https://supabase.com/) account
1. Optionally, [Vercel](https://vercel.com/) account (or your preferred web hosting service)

## What to do (Overview)
1. Create a new project in Supabase
3. Create the required database tables using the [schema](./database-schema)
4. [Clone](#cloning-pathfinder) the PathFinder project
5. Go to the directory of the repository
6. Create and add [environment variables](#environment-variables) to  a `.env` file
7. `npm install` to automatically install required dependencies 
8. `npm start` to start running the web application

* * *

### Cloning PathFinder

Checkout with SVN
> ```
> https://github.com/lhy-hoyin/PathFinder.git
> ```

Using GitHub CLI
> ```
> gh repo clone lhy-hoyin/PathFinder
> ```

### Environment Variables

At the root directroy of the repository, create a `.env` or `.env.development.local` file.  
This file is used to hold the Supabase information specific to your project.  
*Note: This file should **not** be committed to GitHub.*  
```
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_PROJECT_PUBLIC_API_KEYS
```
> You can retrieve your project URL and API keys by logging into Supabase project > `Settings` > `API`  

If you are hosting PathFinder, you will also need to include these environment variables to the web hosting platform.  


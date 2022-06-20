## Welcome

This is PathFinder's GitHub. We are still updating the pages as we continue to develop our project.

### User Guide

Please continue to look out at this section which we will update in the near future.

### Developer Guide

#### What you need
1. [Node.js](https://nodejs.org/en/download/) installed
1. [Supabase](https://supabase.com/) account
1. A hosting service, if you wish to host your own PathFinder (for example, [Vercel](https://vercel.com/) account)

#### What to do
1. Create a new project in Supabase
3. Create the database tables according to the schema [provided](#supabase)
4. Clone this repository
5. Go to the directory of the repository
6. Create and add [environment variables](#environment-variables) to  a `.env` file
7. `npm install` to automatically install required dependencies (as indicated in project.json)  
8. `npm start` to start running application

#### Environment Variables
This file (`.env` or `.env.development.local`) is used to hold the API key to the Supabase database  
```
REACT_APP_SUPABASE_URL=https://PROJECT_URL.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_PROJECT_PUBLIC_API_KEYS
```
You can retrieve your project URL and API keys by logging into Supabase project > `Settings` > `API`

#### Supabase
This section will show the structure of our database tables.
Please continue to look out over here as we update this section when we have finalised our database table structure.

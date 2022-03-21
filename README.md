# What is this? 
A minimal blog with a password-protected dashboard where a blog owner can upload an .md file 
to create a new post, without the need to access the file system. When a file is added or 
removed from the dashboard, an on-demand incremental static regeneration is triggered, and the site 
rebuilds automatically. 

Here's a [live demo](https://blog-d.vercel.app), password is already added as value, please
try adding or removing posts. Any feedback is very much welcomed.

## Usage

1. `npm install` packages. 
2. Define .env variables:
    - Create an .env.local file, and replace "value" with your own values:
        1. Auth cycle:
            - UPLOAD_PASSWORD=my_password_1
            - LOGIN_PASSWORD=my_password_1
            - NEXTAUTH_SECRET=my_password_1
            - REVALIDATE_TOKEN=value
            - USER_TOKEN=value
            - NEXT_PUBLIC_SAVE_TOKEN=my_value_1
            - SAVE_TOKEN=my_value_1*must match NEXT_PUBLIC_SAVE_TOKEN*
        2. MongoDB (create a db [here](https://www.mongodb.com/atlas/database)). Add to .env.local:
            - MONGODB_URI=value
            - MONGODB_DB=value
            - MONGODB_COLLECTION=value
        3. Add these to .local.env (I promise to refactor these soon):
            - NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
            - NEXTAUTH_URL=http://localhost:3000
            - BASE_URL=http://localhost:3000
            - NEXT_PUBLIC_URL=http://localhost:3000
            - NEXT_PUBLIC_CHAT_URL=http://your-chat-preferred-server
3. Open /lib/data.js and update it with your own values. 
4. `npm run dev` to run locally in dev mode, or `npm run build` and `npm start` to run local production build.

## Deploy

Deploy and change local .env variables to the ones provided by domain. Vercel was fast, nice and easy in my experience. 




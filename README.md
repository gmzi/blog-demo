# Blog

![Demo](https://res.cloudinary.com/dft2z1qwf/image/upload/v1648140535/screenshot_y9dhoi.png)
<br>
A Next.js blog with a dashboard and a text editor.

## What is this?

A [Next.Js](https://nextjs.org) blog with a password-protected dashboard where a blog owner can either upload an .md file, or write in the [editor](https://github.com/uiwjs/react-md-editor) to create a new post. When a post is added or removed from the dashboard, an on-demand incremental static regeneration is triggered. The authentication is handled by [next-auth](https://next-auth.js.org).

Here's a [live demo](https://blog-gmzi.vercel.app), password is already added so you guys can play around with it.

## Usage

1. Clone repo.
   - optionally configure your local instance:
     - `git remote add instance <instance_url>`
     - stage and commit local changes.
     - `git push -u instance <branchName>` push to remote instance only.
     - `git pull origin master` pull changes from template.
2. `npm install` packages.
3. Setup the database to store your posts (we're using [mongodb](https://www.mongodb.com) for this demo).
4. Create .env.local file with these variables:

   - (mind fields marked as "value_1" and "value_2" must match):  
      MONGODB_URI=value  
      MONGODB_DB=value  
      MONGODB_COLLECTION=value

     NEXT_PUBLIC_SAVE_TOKEN=value_1  
      SAVE_TOKEN=value_1

     UPLOAD_PASSWORD=value_2  
      LOGIN_PASSWORD=value_2  
      NEXTAUTH_SECRET=value_2  
      REVALIDATE_TOKEN=value  
      USER_TOKEN=value

     NEXT_PUBLIC_BASE_URL=http://localhost:3000/api  
      NEXTAUTH_URL=http://localhost:3000  
      BASE_URL=http://localhost:3000  
      NEXT_PUBLIC_URL=http://localhost:3000

5. Open /lib/data.js, change values for your own.
6. `npm run dev` to run locally in dev mode, or `npm run build` and `npm start` to run local production build.

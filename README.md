# Branches

1. Create a new branch for each new user.
2. Work on `master` for new features and improvements.
3. Checkout to user branch.
4. Merge master on user to bring latest changes.
5. Go to user's repo, and pull `git pull origin userBranchName`.

-
- create a new branch for each new instance. Each instance will pull `git pull origin instanceName`

## Instructions

1. Clone repo and config your instance:
   - `git remote add instance <instance_url>`
   - stage and commit local changes.
   - `git push -u instance <branchName>` push to remote instance only.
   - `git pull origin myInstance` pull changes from template's user branch.
2. `npm install` packages.
3. Define .env variables:

   - Create an .env.local file, and replace "value" with your own values (mind "value_1" and "value_2" must match):  
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

4. Open /lib/data-template.js, add your own values and change file name to `data.js`.
5. `npm run dev` to run locally in dev mode, or `npm run build` and `npm start` to run local production build.

## Deploy

- Open .gitignore, remove `/lib/data.js` and `README.md`, push changes to repo.
- set .env variables for hosting platform.

Deploy and change local .env variables to the ones provided by domain. Vercel was fast, nice and easy in my experience.

# Volunteer Developer Onboarding Information

### Thank You
for your willingness to use your skills and talents developing software for **Catalyst Partnerships NW**.  This brief document is intended to step you through the onboarding process:
* Install necessary tools
* Clone the repository
* Install the MongoDB database locally
* Interact with the codebase/make changes
* Explain the Git workflow we use

As you work through this process, suggestions are always welcome.  [Email Mike](mailto:mikehainespdx@gmail.com) with any ideas, tools, or suggestions that could make things better, and especially if you'd like to contribute needed changes to this codebase.

#### Install Necessary Tools:
**New: Fully automated setup if you are running Ubuntu 18.04:** You can run the following command from your terminal that will guide you through the installation and setup of the tool. This requires running the following command:
`export AVT_GIT_BRANCH=develop && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -`

**IDE/Text Editor:** This web application is written entirely in javascript and runs in an internet browser. **[Notepad++](https://notepad-plus-plus.org/)** works nicely, but if you own IntelliJ, ATOM, etc...go for it.

**Command Line Interface/Console:** There are many tools one may use - git Bash, Windows PowerShell, Mac Terminal, cygwin, etc...use whatever you are comfortable using.  For the purposes of this readMe, we will use the word **console** for this type of application.

**Install Git: [git-scm.com](https://git-scm.com/)** - If you don't already have it loaded, download the latest release from that page.  All default options are fine, although you may wish to choose your text editor.  Git Bash comes with this download (at least it does for Windows), and comes highly recommended.

**Install Node.js** 
* Check to see if you have node installed by typing `node -v` into a console.
* If no node, [download it here](https://nodejs.org/en/download/).
* Installing it with default settings is fine.
* If you have any consoles running, you'll have to restart them for node to be recognized.

**MongoDB Community version 3.4 Download and Installation:**
* [Version 3.4 Download](https://www.mongodb.com/download-center#previous)
	* Community Server should be highlighted at the top
	* Pick your operating system from the tabs under that
	* Choose 3.4.10, and Download.
* Open the .msi file (or whatever it is on a Mac), and do a Complete Install

**Clone the Catalyst Repo**
* Create or select a folder where you want to store the repo
* Open a git-enabled console and make sure the current working directory is that folder.
* Type `git clone https://github.com/dandahle/Catalyst-AppVetting.git` to clone the repo to that folder.
* Type `cd Catalyst-AppVetting/` to change to the folder where the files are located. You will be on the master branch.
* *If you have a console that does NOT tell you what folder you are in and what branch you are on, it is recommended you find one that does.*
* Type `git checkout develop` to get to the working development branch.

We'll come back to how to name branches and merge changes later.

For future reference (but do it now):
* Head over to [The Catalyst GitHub Repo](https://github.com/dandahle/Catalyst-AppVetting)
* Bookmark that page for future use

**Setting up Mongo for use with the Catalyst Appvetting App**
* On your root C:\ drive, Create a folder `data`
* Inside that, create a folder `db` so `C:\data\db` exists.
* (This is where the Catalyst app stores the data for the MongoDB)
* Go to the mongodb.exe folder: `C:\Program Files\MongoDB\Server\3.4\bin` (we'll call this the *mongo bin* as we refer to that folder from here on.)
* Open a console pointed to the mongo bin
* Type `./mongod` (that should start the server locally - if firewall comes up, you can choose the local option)

To be sure it is working, and further configuration:
* Open a new console from the mongo bin folder
* Type `./mongo` (prompt disappears after Mongo Shell info appears - you are now in the *Mongo Shell*.)
* Type `show dbs` (should be admin and local)
* Type `use admin` (should reply *switched to db admin*)
* Because the Mongo Shell doesn't like to insert text, we recommend, for the next step, that you
* *Copy the next line into a text editor:*
	* `db.createUser({user:'', pwd: '', roles: [ { role: 'userAdmin', db:'admin'} ] })`
* Create a user name and password and insert them in between the ''s, then paste that into the console. It should look like this:
* `db.createUser({user:'myUserName', pwd: 'myPassword123!%', roles:<...etc...>`
* You should receive a message back that looks like 
``` 
Successfully added user: {
	"user" : "yourUserNameHere",
    "roles" : [
    	{
    		"role" : "userAdmin",
            "db" : "admin"
        }
   	]
}
```        
* If it doesn't give you the above success message within a few seconds, close the console window, open another one and repeat all steps from *Type `./mongo`*
* KEEP TRACK of this userName and Password, you'll need it in a minute (then you can forget it).

So far, the database is set up and running properly with all the folder configurations necessary.  We can now close the Mongo Shell console (keep the mongod server running in the other bash window). Time to configure the Catalyst Appvetting software.

**Configure the Appvetting Software**
* Head back to the catalyst repo folder.
* Open `.env` in text editor or IDE of choice, and update the file with the information you received from Dan/Mike. 
* Once you have saved your personal .env, open a console in the AppVetting root, and 
* Type `node createAdminUser`  
* At this point, you have used the .env file to connect the MongoDB to the mongo username and password, and you have created a user you will need once we open the app in a browser window.  So, we're all set!


#### Starting the Software 

If your mongod instance is still running, skip to step 3. Otherwise, these are the steps you'll need to take every time you restart your computer or shut down the mongod server.
1. Double Click mongod (found at `C:\Program Files\MongoDB\Server\3.4\bin` on Windows, not sure on mac.  It's the Mongo Bin from earlier...you should be familiar with where it is installed.
	* You may also open a console from the mongo bin folder and type `./mongod` if you prefer
	* A console window should be open saying *waiting for connection on port 27017*
2. Open another console window in the Catalyst repo folder
3. Type `npm install` (definitely the first time for each branch, or if you've made serious changes, otherwise, it's optional)
4. Type `npm start`
5. Open a browser (like Chrome, Safari, (anything but IE))
6. At the url, type `localhost:8000` - - you're in!

#### Using the Software

Now that you're in, you can mess around with the software.  You'll want a completed application form in order to observe the features of the software.  From `localhost:8000`...
* Upper right corner - click Blue `Log In` button.
* Enter the credentials you used in the createUserAdmin section of config.js - Save them to your browser (it's only a local instance) for convenience.
* Click `Apply` tab to fill out an application (fill in, like ALL the fields, and be sure to click "Yes" radio buttons to fill in more information) and click Submit.  This will save the application information in your local database, so you only have to do this once.
* From the success page, click on the `Vetting` tab (if it is there.  If not, navigate back to `localhost:8000`).  Click around, change data, enter data, etc.
* **Users and Roles:** Click on the `Users` button - you should see yourself as an ADMIN.  Click `Add New User` to add a user with different roles to see what permissions they have to see what they see.  For instance, Site Assessor roles cannot see the `Vetting` tab.  There are certain places Vetting agents can't enter information in the Site Assessment views, and so on. 

### **If You're Interested in fixing issues and submitting them for review, read on...**

**Take a look** at the Open Issues using the Issues Tab at the top of the GitHub page.

#### Submitting changes to the codebase

Summary: We begin by **branching off develop,** making changes to that branch, and submitting merge requests **compared with develop.**  We continually work out the details of this, and will update this file accordingly (especially if you find some method that works better).  But for now, please follow the instructions below to submit code changes.  

**Begin Your Branch - open a console from your local catalyst repo folder:**
* `git checkout develop`
* Use the "Issue Code" Number from the google doc spreadsheet to name your branch.  If you must test, please use TST-##.
* For Example: `git branch VW-12`
* Check out the branch: `git checkout VW-12`
* Create the remote github branch: `git push -u origin VW-12`

**During Development**
* Make your code changes, committing them to your local branch.  (for example):
	`git commit -am "insert commit message here, saying what you did"`
* We also encourage you to commit your local branch to the remote repository early and often using the following command:
	`git push`

	*(Don't worry - this doesn't merge it into the master branch or anything - it just saves your work remotely on a branch of the same name, so you have a backup in case something goes wrong...)*

**Before the final pull request.  Go to your branch and...**
* `git status` - - if there is anything to commit, be sure to
	`git commit -am "commit message here"   THEN:
* `git checkout develop` 
* `git pull` -- pulls any changes from other developers
* `git checkout <yourBranch>`
* `git merge develop` -- merges those changes into your branch. 
* `git push` -- one final local branch push to remote branch.  NOW...

**Create a Pull Request**
After pushing your local changes to the gitHub repo branch:
* point your browser to the repository on github.com.
* Make sure you are signed in to GitHub
* Click the `Pull Requests` tab.
* Click `New Pull Request`.
* In the **base:** dropdown, **select develop. <-- IMPORTANT**
* In the **compare:** dropdown, select the branch you recently pushed to the repository.
* Be sure the changes you have made are reflected in the commits and code comparison below.
* Click `Create pull request`.
* Modify the Title: use code and description title from the spreadsheet, like `VW-12: Fixed Vetting Worksheet Buttons`
* Modify the Description (be as brief as you want) - basically be sure to highlight the changes this Pull Request is introducing to the develop branch.

And that should create a Pull Request.  If there are any issues with this process, please let Mike know.

**Properly Shutting Down MongoDb** (when you're finished for the day)
* Open bash from the Mongo bin folder
* Type `./mongo`
* Type `use admin`
* Type `db.shutdownServer()`

	Failure to do this will result in some sort of error upon next open.  It usually still works, though.

### Thanks Again
for helping out.  Contact Mike with any questions you may have.

### Good reads
* Anatomy of an HTTP Transaction - https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
* Using express, handlebars, and mongoDB - https://sites.google.com/site/redmahbub/development/hbs-mongo-with-express4

### MongodB Documentation
* mongoDB - https://docs.mongodb.com/manual/introduction/
* mongoDB Node.js driver quick reference - http://mongodb.github.io/node-mongodb-native/2.2/
* mongoDB Node.js driver API - http://mongodb.github.io/node-mongodb-native/2.2/api/

### Good reads
* Anatomy of an HTTP Transaction - https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
* Using express, handlebars, and mongoDB - https://sites.google.com/site/redmahbub/development/hbs-mongo-with-express4

### Documentation
* mongoDB - https://docs.mongodb.com/manual/introduction/
* mongoDB Node.js driver quick reference - http://mongodb.github.io/node-mongodb-native/2.2/
* mongoDB Node.js driver API - http://mongodb.github.io/node-mongodb-native/2.2/api/

### Packages
*Package* | *Description* | *Documentation*
--- | --- | ---
Bluebird | Full feature promise library with ES6 support | http://bluebirdjs.com/docs/
body-parser | Parse incoming request bodies in a middleware before your handlers, availabe under the `req.body` property | www.ewiggin.gitbooks.io/expressjs-middleware/content/body-parser.html
bootstrap | HTML, CSS, and JS framework for developing responsive, mobile first projects on the web | http://getbootstrap.com/getting-started/
cookie-parser | Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a `secret` string, which assigns `req.secret` so it may be used by other middleware | www.github.com/expressjs/cookie-parser
debug | tiny node.js debugging utility modelled after node core's debugging technique | www.npmjs.com/package/debug
express | Web framework for Node.js | www.expressjs.com
forever | Tool used to ensure a node script runs uninterrupted | www.npmjs.com/package/forever
jquery | jQuery is a fast, small, and feature-rich JavaScript library | http://api.jquery.com/
hbs | HTML semantic template builder | www.handlebarsjs.com
mongodb | official MongoDB driver for Node.js, needed for mongoose | www.docs.mongodb.com/getting-started/node/client/
mongoose | An object modeling tool used with mongoDB designed to work in an asynchronous environment | www.mongoosejs.com/docs/guide.html
morgan | HTTP request logger middleware for node.js | www.npmjs.com/package/morgan
request | Wrapper to use basica HTTP request functions | www.npmjs.com/package/request#http-authentication
serve-favicon | favicon serving middleware with caching | www.npmjs.com/package/serve-favicon
X-editable | Library for inline editing | https://vitalets.github.io/x-editable/

module.exports = {
	/**
	 * NOTE: THIS FILE (once it is named config.js) IS INCLUDED IN .gitignore
	 * so your credentials will never be seen by anyone
	 * else who happens to contribute to this codebase.
	**/

	//setting up your localhost as your "ec2" instance
	ec2: {
		public_ip: '127.0.0.1',
		port: 8000,
	},

	/**
	 * This section authorizes the software to interact with the mongoDB.
	 * Change the username and password in the mongo section below 
	 * to the SAME ONES you used when setting up mongo in the 
	 * db.createUser command earlier...once this is set up, you will no longer
	 * need to remember these credentials.
	**/
	mongo: {
		host: 'localhost',
		db: 'catalyst',
		username: process.env.DB_USERNAME, //change this
		password: process.env.DB_PASSWORD, //change this
		authSource: 'admin',
		port: 27017
	},

	/** 
	 * The Actual Software has a login function, once you open it in a browser.
	 * In this section, you need to change all 4 lines.
	 * You will need to use the email and password you insert below to log in 
	 * to the software. You will not receive an email of any kind, so it 
	 * can be fake, BUT set it to something you can remember - you'll need it often.
	 * (of course you can always re-open this file and check)
	 * The software uses your first and last name to greet you and keep track of who 
	 * entered notes and such, so go ahead and use your real name here... 
	**/
	createAdminUser: {
		email: process.env.CATALYST_USER_EMAIL,  //change this
		password: process.env.CATALYST_USER_PASSWORD, //change this
		first: process.env.CATALYST_USER_FIRST_N,  //change this to your first name
		last: process.env.CATALYST_USER_LAST_N,  //change this to your last name
	}
}
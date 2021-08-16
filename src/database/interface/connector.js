const mysql = require('promise-mysql');
const SqlString = require('sqlstring');

class Database {
	constructor() {
		this.database = null;
	}

	async init() {
		// Check if parameter is passed in for QA
		await this.startDatabase();
		this.queries = null;
		await this.initQueries();
		return this;
	}

	async initQueries() {
		const DBQuery = require('./queries');

		const Query = new DBQuery(this);
		this.queries = Query;
	}


	async startDatabase() {
		const pool = await mysql.createPool({
			connectionLimit : 10,
			host            : process.env.DATABASE_HOST,
			user            : process.env.DATABASE_USERNAME,
			password        : process.env.DATABASE_PASSWORD,
			database        : process.env.DATABASE_NAME.toLowerCase(),
		});
		this.database = pool;
	}

	async getDatabase() {
		return this.database;
	}

	async query(statement, values = []) {
		try{
			let dbQuery = null;
			if (values.length !== 0) {
				dbQuery = SqlString.format(statement, values);
			}
			else {
				dbQuery = statement;
			}
			const result = await this.database.query(dbQuery);
			return result;
		}
		catch(e) {
			// log('ERROR', e);
		}

	}
}
module.exports = Database;

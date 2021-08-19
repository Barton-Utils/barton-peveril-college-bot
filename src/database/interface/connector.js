const mysql = require('promise-mysql');
const SqlString = require('sqlstring');
const { error, info, warn, alert } = require('../../utility/functions/logger');

class Database {
	constructor() {
		this.database = null;
	}

	async init() {
		// Check if parameter is passed in for QA
		info('Initializing database connection and connecting pools.');
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
		alert(`Starting connection to ${process.env.DATABASE_HOST} using database ${process.env.DATABASE_NAME}!`);
		warn('Using account:');
		warn(`Username: ${process.env.DATABASE_USERNAME}`);
		warn(`Password: ${process.env.DATABASE_PASSWORD}`);
	}

	async getDatabase() {
		return this.database;
	}

	async query(statement, values = []) {
		try{
			let dbQuery = null;
			if (values.length !== 0) {
				info(`Executing query: ${statement.toUpperCase()} | Params: [${values.join(', ')}]`);
				dbQuery = SqlString.format(statement, values);
			}
			else {
				info(`Running query ${statement.toUpperCase()}`);
				dbQuery = statement;
			}
			const result = await this.database.query(dbQuery);
			return result;
		}
		catch(e) {
			error('DATABASE QUERY ERROR', e);
		}

	}
}

module.exports = Database;
class Query {
	constructor(pool) {
		this.pool = pool;
	}

	/**
     * Fetches value from MISC DB when given a name to search for if none is found
     * it will return false. Returned value if any is a string.
     *
     * @param {string} name The name of the variable
     *
     * @returns {string} The value of the variable
    **/
	async getVar(name) {
		const statement = 'SELECT value FROM MISC WHERE name = ?';
		const params = [name];

		const result = await this.pool.query(statement, params);
		return result;
	}
}

module.exports = Query;

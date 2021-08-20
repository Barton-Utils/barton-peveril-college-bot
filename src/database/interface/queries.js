class Query {
	constructor(pool) {
		this.pool = pool;
	}

	async allBirthdays() {
		const statement = 'SELECT * FROM birthday';

		return await this.pool.query(statement);

	}

	async getBirthday(id) {
		const statement = 'SELECT * FROM birthday WHERE id = ?';
		const params = [id];

		return await this.pool.query(statement, params);
	}

	async delBirthday(id) {
		const statment = 'DELETE FROM BIRTHDAY WHERE id = ?';
		const params = [id];

		return await this.pool.query(statment, params);
	}

	async updateBirthdayMessage(id, message) {
		const statment = 'UPDATE BIRTHDAY SET message = ? WHERE id = ?';
		const params = [message, id];

		return await this.pool.query(statment, params);
	}

	async updateBirthdayImage(id, image) {
		const statment = 'UPDATE BIRTHDAY SET img = ? WHERE id = ?';
		const params = [image, id];

		return await this.pool.query(statment, params);
	}

	async addBirthday(id, day, month, year) {
		const statment = 'INSERT INTO BIRTHDAY (ID, DAY, MONTH, YEAR) VALUES (?,?,?,?)';
		const params = [id, day, month, year];

		return await this.pool.query(statment, params);
	}
}

module.exports = Query;

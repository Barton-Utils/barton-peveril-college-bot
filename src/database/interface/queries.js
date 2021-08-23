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

	async getSpecificBirthdayIDS(day, month) {
		const statment = 'SELECT id FROM BIRTHDAY WHERE day = ? AND month = ?';
		const params = [day, month];

		const result = await this.pool.query(statment, params);

		const ids = [];
		result.forEach(entry => {
			ids.push(entry.id);
		});

		return ids;
	}

	async checkVerification(code) {
		const statment = 'SELECT * FROM VERIFY WHERE uuid = ?';
		const params = [code];

		return await this.pool.query(statment, params);
	}

	async addVerificationCode(id, code, email) {
		const statment = 'INSERT INTO VERIFY (id, uuid, email) VALUES (?, ?, ?)';
		const params = [id, code, email];

		return await this.pool.query(statment, params);
	}

	async deleteVerificationCode(code) {
		const statment = 'DELETE FROM VERIFY WHERE uuid = ?';
		const params = [code];

		return await this.pool.query(statment, params);
	}

	async addMember(id, email) {
		const statment = 'INSERT INTO MEMBERS (id, email) VALUES (?, ?)';
		const params = [id, email];

		return await this.pool.query(statment, params);
	}

	async getMemberByEmail(email) {
		const statment = 'SELECT * FROM MEMBERS WHERE email = ?';
		const params = [email];

		return await this.pool.query(statment, params);
	}
}

module.exports = Query;

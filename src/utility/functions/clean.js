const { error } = require('./logger');
module.exports = (text) => {
	try {
		if (typeof (text) === 'string') {
			return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		}
		else {
			return text;
		}
	}
	catch(err) {
		error('Cleaning ERR', err);
		return text;
	}

};
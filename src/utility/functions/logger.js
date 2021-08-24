const chalk = require('chalk');
const log = console.log;
const dateFormat = require('dateformat');
const now = Date.now();

module.exports = {
	info: function(message) {
		log(`${chalk.bold.green('(INFO)')} ${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} ${message}`);
	},
	error: function(message, err = null) {
		if (err !== null) {
			log(`${chalk.bold.red('(ERROR)')} ${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} ${message}`);
			log(err);
		}
		else {
			log(`${chalk.bold.red('(ERROR)')} ${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} ${message}`);
		}
	},
	warn: function(message) {
		log(`${chalk.bold.magenta('(WARN)')} ${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} ${message}`);
	},
	alert: function(message) {
		log(`${chalk.bold.blue('(ALERT)')} ${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} ${message}`);
	},
	unformattedTime: function(message) {
		return `${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')} | ${message}`;
	},
	time: function(message) {
		log(`${chalk.dim.yellow(`[${dateFormat(now, 'yyyy-mm-dd HH:MM:ss')}]`)} | ${message}`);
	},
};
'use strict';
const fs = require('fs');
const jsonFiles = {};

function fetchFilePaths(directory, callback) {
	const items = fs.readdirSync(directory);
	let index = 0;
	(function next() {
		const rawFilePath = items[index++];
		if (rawFilePath) {
			const filePath = `${directory}/${rawFilePath}`,
				file = fs.statSync(filePath);
			if (file && file.isDirectory()) {fetchFilePaths(filePath, () => next());}
			else {
				const fileName = filePath.split('/').pop().split('.')[0];
				jsonFiles[fileName] = JSON.parse(fs.readFileSync(filePath));
				next();
			}
		}
		else {callback();}
	})();
}

module.exports = {
	loadDataFiles: function() {
		return new Promise(resolve =>
			fetchFilePaths('./src/data', () => resolve()));
	},
	fetchValue: function(file, path) {
		let data = jsonFiles[file];
		if (data) {
			path.split('.').forEach(key => data = data[key]);
			return data;
		}
		else {return null;}
	},
};
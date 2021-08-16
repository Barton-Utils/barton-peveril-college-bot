module.exports = (sequelize, DataTypes) => {
	const Example = sequelize.define('example', {
		name: {
			type: DataTypes.STRING(100),
		},
		content: {
			type: DataTypes.STRING(100),
		},
	});
	return Example;
};

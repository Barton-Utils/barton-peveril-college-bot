const { oneLine } = require('common-tags');
const Discord = require('discord.js');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['info', 'about'],
			description: oneLine`
			Send details about the bot`,
			options: {
				permissions: {
					roles: ['875741719050715166'],
					users: [],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['info'],
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async pre(client, message, args) {
		// const [Commands] = await client.database.models.Commands.findOrCreate({
		// 	where: {
		// 		GuildId: message.guild.id,
		// 		command_name: this._state.triggers[0],
		// 	},
		// });
		return true;
	}

	async register(slashInstance) {
		const data = new slashInstance()
			.setName('info')
			.setDescription('Get information about the bot!');

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Barton Peveril College Bot')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.addField('Created by:', ':white_small_square: <@436876982794452992>\n:white_small_square: Add yourself here if you contrubute!')
			.addField('Repository:', ':white_small_square: [barton-peveril-college-bot](https://github.com/Ru-Pirie/barton-peveril-colege-bot)')
			.addField('Coded in:', ':white_small_square: discord.js v13 [View on github](https://github.com/discordjs)')
			.setTimestamp();

		await message.channel.send({ embeds: [ embed ] });
	}

	async slash(client, interaction) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Barton Peveril College Bot')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.addField('Created by:', ':white_small_square: <@436876982794452992>\n:white_small_square: Add yourself here if you contrubute!')
			.addField('Repository:', ':white_small_square: [barton-peveril-college-bot](https://github.com/Ru-Pirie/barton-peveril-colege-bot)')
			.addField('Coded in:', ':white_small_square: discord.js v13 [View on github](https://github.com/discordjs)')
			.setTimestamp();

		await interaction.reply({ embeds: [ embed ] });
	}
}

module.exports = {
	Command,
};
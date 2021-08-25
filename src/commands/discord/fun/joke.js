const { oneLine } = require('common-tags');
const Discord = require('discord.js');
const fetch = require('node-fetch');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['joke', 'dadjoke'],
			description: oneLine`
			The birthday master command!`,
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
			examples: ['joke'],
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
			.setName('dadjoke')
			.setDescription('Get a dad joke');

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		let jokeResult = await fetch('https://icanhazdadjoke.com', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'Barton Peveril College Bot (https://github.com/Ru-Pirie/barton-peveril-college-bot)',
			},
		});

		jokeResult = await jokeResult.json();

		const embed = new Discord.MessageEmbed()
			.setTitle('Dad Joke:')
			.setColor('LUMINOUS_VIVID_PINK')
			.setDescription(jokeResult.joke);
			// .setImage(`https://icanhazdadjoke.com/j/${jokeResult.id}.png`);

		message.channel.send({ embeds: [ embed ] });
	}

	async slash(client, interaction) {
		let jokeResult = await fetch('https://icanhazdadjoke.com', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'Barton Peveril College Bot (https://github.com/Ru-Pirie/barton-peveril-college-bot)',
			},
		});

		jokeResult = await jokeResult.json();

		const embed = new Discord.MessageEmbed()
			.setTitle('Dad Joke:')
			.setColor('LUMINOUS_VIVID_PINK')
			.setDescription(jokeResult.joke);
			// .setImage(`https://icanhazdadjoke.com/j/${jokeResult.id}.png`);

		interaction.reply({ embeds: [ embed ] });
	}

}

module.exports = {
	Command,
};

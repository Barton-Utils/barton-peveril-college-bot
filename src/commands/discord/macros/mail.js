const { oneLine } = require('common-tags');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['mail'],
			description: oneLine`
			Send you the link to your mail`,
			options: {
				permissions: {
					roles: [],
					users: [],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['qxtra'],
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
			.setName('mail')
			.setDescription('Get link to your Barton email.');
		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		await message.delete();
		await message.channel.send(args.join(' '));
	}

	async slash(client, interaction) {
		await interaction.reply({ content:'https://mail.google.com/mail/u/0/#inbox', ephemeral: true });
	}

}

module.exports = {
	Command,
};

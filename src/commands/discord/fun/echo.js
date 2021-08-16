const { oneLine } = require('common-tags');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['echo'],
			description: oneLine`
			Make me say something!`,
			options: {
				permissions: {
					admin_lock: true,
					trust_lock: false,
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['say <args>'],
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
			.setName('echo')
			.setDescription('Make me say something!')
			.addStringOption(option =>
				option
					.setName('message')
					.setDescription('The Message that you want to send'));

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		message.channel.send('a')
	}

	async slash(client, interaction) {
		console.log(interaction)
		await interaction.reply({ content:'Welcome to testing!', ephemeral: true });
		await interaction.followUp({ content: 'Testing stuff!', ephemeral: true });
	}

}

module.exports = {
	Command,
};

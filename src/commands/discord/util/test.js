const { oneLine } = require('common-tags');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['test'],
			description: oneLine`
			This is a command that is used for development and testing purposes not to be executed in production or by non-devs.`,
			options: {
				permissions: {
					roles: ['875741719050715166'],
					users: [],
				},
				restrictions: {
					unstable: true,
					hidden: true,
					dangerous: true,
				},
			},
			examples: ['test <args>'],
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
			.setName('test')
			.setDescription('Command used for development and testing purposes not to be executed in production or by non-devs.')
			.addStringOption(option =>
				option
					.setName('args')
					.setDescription('arguments that may or may not be required'));

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		console.log(await message.guild.commands.set([]))
	}

	async slash(client, interaction) {
		await interaction.reply({ content:'Welcome to testing!', ephemeral: true });
		await interaction.followUp({ content: 'Testing stuff!', ephemeral: true });
	}

}

module.exports = {
	Command,
};

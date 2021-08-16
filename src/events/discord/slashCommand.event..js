const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');
const { Permissions } = require('discord.js');

const i18n = require('../../assets/i18n/i18n.json');
const prettyMs = require('pretty-ms');

class Event {
	constructor(clientAPI, client) {
		this.clientAPI = clientAPI;
		this.client = client;
		this._state = {
			options: {
				event: 'interactionCreate',
			},
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async update(parent) {
		this._state.persist = {
			cache: (new KeyvBuilder(Driver.MemoryStore)),
		};
	}

	async post(client, chain) {
		return true;
	}

	async finally(client) {
		return true;
	}

	async pre(client) {
		return true;
	}
	async process(client, chain, interaction) {
		if (!interaction.isCommand()) return;

		// Does it Exist?
		if (!this.clientAPI.commands.has(interaction.commandName)) return this.client.logger.error('Slash command has be executed which does not have a relevant command (PANIC)');

		// Load the Command from Memory
		const r = await this.clientAPI.commands.get(interaction.commandName);

		// Execute that Command (r)
		await r.slash(client, interaction).catch(async (err) => {
			this.client.logger.error('Command Execution Error (SLASH)', err);
			process = false;
		});
	}
}

module.exports = {
	Event,
};

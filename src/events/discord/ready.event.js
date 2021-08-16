const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');
const { Permissions } = require('discord.js');

const i18n = require('../../assets/i18n/i18n.json');
const prettyMs = require('pretty-ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'ready',
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
	async process(client, chain) {
		// client.logger.info(this.client.BLL.helper.text.Logger.Info.discord_gateway(this.client));
		// client.logger.info(this.client.BLL.helper.text.Logger.Info.cached_guilds(this.client));
		// client.logger.info(this.client.BLL.helper.text.Logger.Info.initialization(this.client));

		// const Permission = Permissions.FLAGS;

		// if (!client.custom.permissions) { client.custom.permissions = {}; }

		// for (const Perms of Object.keys(Permission)) {
		// 	let result = null;
		// 	if (i18n.en_US.PERMS[Perms.toUpperCase()] !== undefined) {
		// 		result = i18n.en_US.PERMS[Perms.toUpperCase()];
		// 	}
		// 	if (result === null) {
		// 		const perm = Perms.split('_').map((v, i, arr) => {
		// 			let permResult = null;
		// 			if (i18n.en_US.PERMS[v.toUpperCase()] !== undefined) {
		// 				permResult = i18n.en_US.PERMS[v.toUpperCase()];
		// 			}
		// 			if (permResult == null) {
		// 				return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
		// 			}
		// 			return permResult;
		// 		}).join(' ');

		// 		result = perm;
		// 	}
		// 	client.custom.permissions[Perms.toUpperCase()] = result;
		// }

		// this.client.Driver.alert(`Took ${prettyMs(client.uptime)} to run ${__filename.split('\\').pop()} for PROCESS`);

		this.client.logger.info('Client has readied and initialized connection with discord using account:');
		this.client.logger.info(`User: ${client.user.tag}`);
		this.client.logger.info(`Application ID: ${client.user.id}`);
		this.client.logger.warn(`Token: ${client.token}`);

		return true;
	}
}

module.exports = {
	Event,
};

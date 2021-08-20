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
		setInterval(async () =>{
			// Work out todays date and then assign the date num and month num for fetching fro the db
			const today = new Date();
			const month = today.getMonth() + 1;
			const day = today.getDate();

			// Get birthday entrys for today
			const ids = await client.DB.queries.getSpecificBirthdayIDS(day, month);

			// Remove roles from non birthday people
			client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.forEach(async member => {
				if (member.roles.cache.has(process.env.BIRTHDAY_ROLE) && !ids.includes(member.id)) {
					await member.roles.remove(process.env.BIRTHDAY_ROLE);
					await member.setNickname(member.displayName.split(' ')[0]);
					await client.user.setActivity('over you dumbasses', {
						type: 'WATCHING',
					});
				}
			});

		}, 1000);
		return true;
	}
}

module.exports = {
	Event,
};

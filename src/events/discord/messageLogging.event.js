const fs = require('fs');

class Event {
	constructor(parent, client) {
		this.clientAPI = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'messageCreate',
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
		return true;
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
	async process(client, chain, message) {
        if (message.author.bot) {

        }
		else if (message.channel.type === 'DM') {
            await fs.appendFileSync(`./logs/dm/${message.author.id}-DM.log`, JSON.stringify({ a:1, b:2, c:3 }, null, 4));

			console.log(message.author.id);
			console.log(this.client.logger.time(message.content));
		}
		else {
			console.log(message.guild.channels.cache.get(message.channel.parentId).name.replace(/\s/gi, '-'));
			console.log(message.channel.name.replace(/\s/gi, '-'));
			console.log(this.client.logger.time(message.content));
		}

		return true;
	}
}

module.exports = {
	Event,
};

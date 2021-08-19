const prefix = process.env.PREFIX;

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
		if (message.channel.type === 'DM') return;
		if (message.author.bot) return;
		if (message.content.toLowerCase() !== 'jam') return;

		await message.author.send('https://tenor.com/view/jelly-jam-jam-gay-rainbow-primerp-gif-15265251');

		return true;
	}
}

module.exports = {
	Event,
};

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

		const parentName = await message.guild.channels.cache.get(message.channel.parentId).name.replace(/[<>:"/\\|?*\s]/gi, '-').replace(/-{1,}/gi, '-');
		const cleanName = await message.channel.name.replace(/[<>:"/\\|?*\s]/gi, '-').replace(/-{1,}/gi, '-');
		if (!fs.existsSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`)) {
			if (!fs.existsSync(`./logs/barton_peveril/txt/${parentName}`)) {
				fs.mkdirSync(`./logs/barton_peveril/txt/${parentName}`);
				fs.writeFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, '');
				this.client.logger.alert(`Category directory: ${parentName} does not exist creating...`);
			}
			fs.writeFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, '');
			this.client.logger.alert(`Log file for channel: ${parentName}/${cleanName} does not exist creating...`);
		}

		if (message.author.bot) {
			if (!fs.existsSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`)) fs.writeFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, '');
			if (message.attachments.size !== 0) {
				if (message.content === '') {
					await fs.appendFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] ${message.attachments.first().attachment}`)}\n`);
				}
				else {
					await fs.appendFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] Content: ${message.content}  (${message.attachments.first().attachment})`)}\n`);
				}
			}
			else if (message.embeds.length !== 0) {
				if (message.content === '') {
					await fs.appendFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, this.client.logger.unformattedTime('EMBED SENT'));
				}
				else {
					await fs.appendFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] Content: ${message.content}  (CONTAINED EMBED)`)}\n`);
				}
			}
			else {
				await fs.appendFileSync(`./logs/barton_peveril/bot/${message.author.id}-BOT.log`, `[${message.author.tag}] ${this.client.logger.unformattedTime(message.content)}\n`);
			}
		}
		else if (message.channel.type === 'DM') {
			if (message.attachments.size !== 0) {
				if (message.content === '') {
					await fs.appendFileSync(`./logs/barton_peveril/dm/${message.author.id}-DM.log`, `${this.client.logger.unformattedTime(`${message.attachments.first().attachment}`)}\n`);
				}
				else {
					await fs.appendFileSync(`./logs/barton_peveril/dm/${message.author.id}-DM.log`, `${this.client.logger.unformattedTime(`Content: ${message.content}  (${message.attachments.first().attachment})`)}\n`);
				}
			}
			else {
				await fs.appendFileSync(`./logs/barton_peveril/dm/${message.author.id}-DM.log`, `${this.client.logger.unformattedTime(message.content)}\n`);
			}
		}
		else if (message.channel.type === 'GUILD_TEXT') {
			if (message.attachments.size !== 0) {
				if (message.content === '') {
					await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) ${message.attachments.first().attachment}`)}\n`);
				}
				else {
					await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content}  (${message.attachments.first().attachment})`)}\n`);
				}
			}
			else {
				await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) ${message.content}`)}\n`);
			}
		}

		return true;
	}
}

module.exports = {
	Event,
};

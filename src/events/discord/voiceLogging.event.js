// const fs = require('fs');

// class Event {
// 	constructor(parent, client) {
// 		this.clientAPI = parent;
// 		this.client = client;
// 		this._state = {
// 			options: {
// 				event: 'voiceStateUpdate',
// 			},
// 			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
// 			maintainers: [{
// 				name: 'Rubens G Pirie',
// 				email: 'rubens.pirie@gmail.com',
// 				discord_id: '436876982794452992',
// 			}],
// 		};
// 	}

// 	async update(parent) {
// 		return true;
// 	}

// 	async post(client, chain) {
// 		return true;
// 	}

// 	async finally(client) {
// 		return true;
// 	}

// 	async pre(client) {
// 		return true;
// 	}
// 	async process(client, chain, oldState, newState) {

// 		// const cleanNameOld = await oldState.channel.name.replace(/[<>:"/\\|?*\s]/gi, '-').replace(/-{1,}/gi, '-');
// 		// const cleanNameNew = await newState.channel.name.replace(/[<>:"/\\|?*\s]/gi, '-').replace(/-{1,}/gi, '-');

//         console.log(oldState.guild.channels.cache.get(oldState.channelId));

// 		// if (!fs.existsSync(`./logs/barton_peveril/vc/${cleanName}.log`)) {
// 		//     fs.writeFileSync(`./logs/barton_peveril/vc/${cleanName}.log`, '');
// 		//     this.client.logger.alert(`Log file for channel: ${cleanName} does not exist creating...`);
// 		// }

// 		// else if (message.channel.type === 'GUILD_TEXT') {
// 		// 	if (message.attachments.size !== 0) {
// 		// 		if (message.content === '') {
// 		// 			await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) ${message.attachments.first().attachment}`)}\n`);
// 		// 		}
// 		// 		else {
// 		// 			await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content}  (${message.attachments.first().attachment})`)}\n`);
// 		// 		}
// 		// 	}
// 		// 	else {
// 		// 		await fs.appendFileSync(`./logs/barton_peveril/txt/${parentName}/${cleanName}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) ${message.content}`)}\n`);
// 		// 	}
// 		// }

// 		return true;
// 	}
// }

// module.exports = {
// 	Event,
// };

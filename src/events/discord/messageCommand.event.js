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

		// Cleanup Input to RegExr
		const clean = message.content.replace(/\s+/g, ' ').replace(/(?:<@)([!&])/, '<@');

		const expr = new RegExp(`^(?:<@!?${client.user.id}>|${prefix})(?:[ ]?){0,}(.*)$`, 'gim');
		const exec = expr.exec(clean);
		if (exec === null || exec[1] === '') return;

		// Process Command Inquiry from RegExr
		const args = exec[1].split(' ');
		const command = args.shift();

		// Does it Exist?
		if (!this.clientAPI.commands.has(command)) return;

		// Load the Command from Memory
		const r = await this.clientAPI.commands.get(command);


		// TO-DO stick command overides here like hidden etc

		// Check if user has any of the required roles or is a whitelisted user
		if (r._state.options.permissions.roles.some((role) => client.guilds.cache.get('875736589836365864').members.cache.get(message.author.id).roles.cache.has(role)) || (r._state.options.permissions.users.includes(message.author.id))) {
			const name = (message.guild !== null ? message.guild.name : null);

			let pre = null;
			if (r.pre !== undefined) {
				pre = await r.pre(client, message, args).catch(async (err) => {
					client.logger.error(err);
					pre = false;
				});
			}

			if (pre === false) {
				if (r.finally !== undefined) {
					await r.finally(client, {}, message, args).catch(async (err) => {
						client.logger.error(err);
					});
				}
				return;
			}

			let process = null;
			await r.execute(client, pre, message, args).catch(async (err) => {
				client.logger.error(err);
				process = false;
			});

			if (process === false) {
				if (r.finally !== undefined) {
					await r.finally(client, {}, message, args).catch(async (err) => {
						client.logger.error(err);
					});
				}
				return;
			}

			let post = null;
			if (r.post !== undefined) {
				post = await r.post(client, process, message, args).catch(async (err) => {
					client.logger.error(err);
					post = null;
				});
			}

			if (r.finally !== undefined) {
				await r.finally(client, post, message, args).catch(async (err) => {
					client.logger.error(err);
				});
			}

			client.logger.info(`Command executed by ${name} (${message.author.tag}) | ${message.channel.name} (${message.channel.id}) | ${message.content}`);
		}


		return true;
	}
}

module.exports = {
	Event,
};

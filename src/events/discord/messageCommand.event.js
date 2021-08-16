const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const prefix = process.env.PREFIX
const admin_lock = process.env.ADMIN_LOCK
const trust_lock = process.env.TRUST_LOCK

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

		// // Validate Permissions and Toggles
		// let trust = await this._state.persist.cache.get('trust.' + message.author.id);
		// let admin = await this._state.persist.cache.get('admin.' + message.author.id);

		// Get Permissions from Guild
		if ((r._state.options.admin_lock && admin === undefined) || (r._state.options.trust_lock && trust === undefined)) {
			// const guild = await client.guilds.fetch(require(path.resolve(this.clientAPI.basePath, 'options.json')).server);
			const member = await message.guild.members.fetch(message.member.id);

			admin = member.roles.cache.has(admin_lock);
			trust = member.roles.cache.has(trust_lock);

			await this._state.persist.cache.set(`admin.${message.author.id}`, admin, 8000);
			await this._state.persist.cache.set(`trust.${message.author.id}`, trust, 15000);
		}

		if (r._state.options.admin_lock && !(admin)) {
			return;
		}
		if (r._state.options.trust_lock && !(admin || trust)) {
			return;
		}

		// TO-DO stick command overides here like hidden etc

		// Execute that Command (r)
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

		return true;
	}
}

module.exports = {
	Event,
};

const { EmbedFactory } = require('../utility/embed');
const path = require('path');

const Discord = require('discord.js');

class utilityService {
	constructor() {
		this.name = path.parse(__filename).name;
		/**
     * Array of error types
     * @type {Array<string>}
     */
		this.errorTypes = ['Invalid Argument', 'Command Failure', 'Database Query Failed'];
	}

	async init() {
		return this;
	}

	async clean(client, text) {
		if (text && text.constructor.name == 'Promise') {text = await text;}
		if (typeof evaled !== 'string') {text = require('util').inspect(text, { depth: 1 });}

		text = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

		return text;
	}

	isLatinString(s, custom = null) {
		let c, whitelist = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		if (custom !== null) {
			whitelist += custom;
		}
		for(c in s) // character in string
		// if whitelist string doesn't include the character, break
		{
			if(!whitelist.includes(s[c])) {return false;}
		}
		return true;
	}

	/**
   *
   * @param {Any} callback - callback that you want to call after timer ends
   * @param {Any} delay - (ms) time in milliseconds
   * @returns
   */
	timer(callback, delay) {
		let id, started, remaining = delay, running;

		this.start = function() {
			running = true;
			started = new Date();
			id = setTimeout(callback, remaining);
		};

		this.pause = function() {
			running = false;
			clearTimeout(id);
			remaining -= new Date() - started;
		};

		this.getTimeLeft = function() {
			if (running) {
				this.pause();
				this.start();
			}

			return remaining;
		};

		this.getStateRunning = function() {
			return running;
		};

		this.start();
	}

	/**
   *
   * @param {Any} obj
   * @returns
   */
	checkType(obj) {
		const entities = Object.keys(obj);
		const response = [];
		for (const entry of entities) {
			const value = obj[entry];
			if (typeof (value) === 'boolean') {
				if (value) {
					response.push(entry);
				}
			}
		}
		return response;
	}

	nearest15Minute(time) {
		const timeToReturn = new Date(time);

		timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
		timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
		timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
		return timeToReturn;
	}

	nearest30Minute(time) {
		const timeToReturn = new Date(time);

		timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
		timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
		timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 30) * 30);
		return timeToReturn;
	}

	getRoundedDate(minutes, d = new Date()) {
		const ms = 1000 * 60 * minutes;
		const roundedDate = new Date(Math.round(d.getTime() / ms) * ms);

		return roundedDate;
	}

	getRoundedDateLuxon(minutes, luxonTime) {
		// const rounded = Math.round(luxonTime.minute / minutes) * minutes;
		// const roundedDown = Math.floor(luxonTime.minute / minutes) * minutes;
		const roundedUp = Math.ceil(luxonTime.minute / minutes) * minutes;

		return luxonTime.set({ minute: roundedUp, second: 0 });
	}

	ordinal(n) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	getNumberSuffix(num) {
		const th = 'th';
		const rd = 'rd';
		const nd = 'nd';
		const st = 'st';

		if (num === 11 || num === 12 || num === 13) return th;

		const lastDigit = num.toString().slice(-1);

		switch (lastDigit) {
		case '1': return st;
		case '2': return nd;
		case '3': return rd;
		default: return th;
		}
	}

	isNumber(input) {
		return /\d/.test((input + ''));
	}

	convertNumToBoolean(num) {
		if(this.isNumber(num)) return Boolean(Number(num));
		return !!num;
	}

	convertTimeZone(d) {
		const date = d;
		let time = null;
		let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
		const am_pm = date.getHours() >= 12 ? 'PM' : 'AM';
		hours = hours < 10 ? '0' + hours : hours;
		const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		time = hours + ':' + minutes + ':' + seconds + ' ' + am_pm;
		return time;
	}

	/**
  *
  * @param {Number} seconds
  * @returns {Promise}
  */
	delayFor(seconds = 5) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, seconds * 1000);
		});
	}

	/**
   *
   * @param {state} state
   * @param {Client} client
   * @param {Message} message
   * @param {int} errorType
   * @param {string} reason
   * @param {string} errorMessage
   */
	async sendErrorMessage(state, client, message, errorType, reason, errorMessage = null) {
		errorType = this.errorTypes[errorType];
		const [Settings] = await client.database.models.Settings.findOrCreate({
			where: {
				GuildId: message.guild.id,
			},
		});
		if (reason === undefined) {
			reason = '';
		}
		const embed = new EmbedFactory()
			.title(`${client.custom.emojis.fail.fqdn} Error: \`${state.triggers[0]}\``)
			.description(`\`\`\`diff\n- ${errorType}\n+ ${reason}\`\`\``)
			.addField('Usage', `\`${Settings.prefix}${state.usage}\``, true)
			.timestamp()
			.color()
			.done();
		if (state.examples) {
			embed.addField(
				'Examples',
				state.examples.map((e) => `\`${Settings.prefix}${e}\``).join('\n'), true,
			);
		}
		if (errorMessage) { embed.addField('Error Message', `\`\`\`${errorMessage}\`\`\``); }
		message.channel.send(embed);
	}

	/**
   * Capitalizes a string
   * @param {string} string
   * @returns
   */
	capitalise(string) {
		return this.capitalize(string);
	}

	/**
   * Capitalizes a string
   * @param {string} string
   * @returns
   */
	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	/**
 * Removes specifed array element
 * @param {Array} arr
 * @param {*} value
 */
	removeElement(arr, value) {
		const index = arr.indexOf(value);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	}

	/**
 * Trims array down to specified size
 * @param {Array} arr
 * @param {int} maxLen
 */
	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`and **${len}** more...`);
		}
		return arr;
	}

	/**
 * Trims joined array to specified size
 * @param {Array} arr
 * @param {int} maxLen
 * @param {string} joinChar
 */
	trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
		let string = arr.join(joinChar);
		const diff = maxLen - 15; // Leave room for "And ___ more..."
		if (string.length > maxLen) {
			string = string.slice(0, string.length - (string.length - diff));
			string = string.slice(0, string.lastIndexOf(joinChar));
			string =
      string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
		}
		return string;
	}

	/**
 * Gets current status
 * @param {...*} args
 */
	getStatus(...args) {
		for (const arg of args) {
			if (!arg) return 'disabled';
		}
		return 'enabled';
	}

	/**
 * Surrounds welcome/farewell message keywords with backticks
 * @param {string} message
 */
	replaceKeywords(message) {
		if (!message) {return message;}
		else {
			return message
				.replace(/\?member/g, '`?member`')
				.replace(/\?username/g, '`?username`')
				.replace(/\?tag/g, '`?tag`')
				.replace(/\?size/g, '`?size`');
		}
	}

	/**
   * Creates and sends system failure embed
   * @param {Guild} guild
   * @param {string} error
   * @param {string} errorMessage
   */
	sendSystemErrorMessage(guild, client, error, errorMessage) {
		// Get system channel
		const systemChannelId = this.db.settings.selectSystemChannelId
			.pluck()
			.get(guild.id);
		const systemChannel = guild.channels.cache.get(systemChannelId);

		if (
		// Check channel and permissions
			!systemChannel ||
      !systemChannel.viewable ||
      !systemChannel
      	.permissionsFor(guild.me)
      	.has(['SEND_MESSAGES', 'EMBED_LINKS'])
		) { return; }

		systemChannel.send(new EmbedFactory()
			.author(
				`${this.user.tag}`,
				this.user.displayAvatarURL({ dynamic: true }),
			)
			.title(`${client.custom.emojis.fail.fqdn} System Error: \`${error}\``)
			.description(`\`\`\`diff\n- System Failure\n+ ${errorMessage}\`\`\``)
			.timestamp()
			.color(guild.me.displayHexColor)
			.done(),
		);
	}

	/**
 *
 * @param {time} fn
 * @returns
 */
	async calculateTime(fn) {
		const startingTime = (new Date()).getTime();
		const response = await fn;
		const endingTime = (new Date()).getTime();
		return {
			response,
			time: Math.abs(startingTime - endingTime),
		};
	}

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Args} args
	 * @param {Number} argsStart
	 */
	async getUser(client, message, args, argsStart) {
		const start = await Date.now();
		const isID = !isNaN(args[argsStart]);

		const user = {};

		user.presence = true;

		if(!args[argsStart]) {
			user.data = await message.author;
			user.type = 'author';
		}
		const userMentions = message.mentions.users.has(client.user.id) ? message.mentions.users.delete(client.user.id) : message.mentions.users;
		if(userMentions.first()) {
			user.data = await userMentions.first();
			user.type = 'mention';
		}
		if(isID && !user.data) {
			user.data = await client.users.cache.get(args[argsStart]);

			if(!user.data) {
				user.data = await client.users.fetch(args[argsStart], true).catch(() => {});
				user.presence = false;
				user.type = 'fetch';
			}
			else {
				user.type = 'cache';
			}
		}

		const end = await Date.now();

		user.transaction = end - start;
		return user;
	}

	/**
	 * @param {Client} client - the client
	 * @param {message} message - the message that the user has typed
	 * @param {args} args - the arguments that were passed in
	 * @param {Number} argsStart - the argument that it should look at (which element)
	 */
	async getMemberOrUser(client, message, args, argsStart) {
		if (message.channel.type === 'dm') {
			return this.getUser(client, message, args, argsStart);
		}
		return this.getMember(client, message, args, argsStart);
	}

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Args} args
	 * @param {Number} argsStart
	 */
	 async getMember(client, message, args, argsStart) {
		const start = await Date.now();
		const isID = !isNaN(args[argsStart]);

		let user = {};

		user.data = null;
		user.presence = true;

		if(!args[argsStart]) {
			user.data = await message.member;
			user.type = 'author';
		}
		if(message.mentions.users.first()) {
			user.data = await message.mentions.members.first();
			user.type = 'mention';
		}
		if(isID && !user.data) {
			user.data = await client.users.cache.get(args[argsStart]);
			user.data = await message.guild.members.cache.get(user.data.id);
			user.type = 'cache';
		}

		if (user.data === null) user = { data: null };

		const end = await Date.now();

		user.transaction = end - start;
		return user;
	}

	/**
	 * @param {object} client The clients user object
	 * @param {object} user The object of a user that has triggered and event to be logged
	 * @param {string} color The hex string for the colour of the embed
	 * @param {object} command The command object
	 * @param {object} message The object of the command message
	 * @param {array} args Arguments provided with the command
	 * @param {string} outcome The outcome of the command
	 * @param {string} stage The stage of the command that was ran
	**/
	commandLog(client, user, command, message, args, outcome, stage) {
		const roles = [];
		// command.permissions.roles.forEach(role => {
		// 	if (message.guild.roles.cache.get(role)) {
		// 		roles.push(message.guild.roles.cache.get(role));
		// 	}
		// });
		const embed = new Discord.MessageEmbed()
			.setColor('GOLD')
			.setTitle(`Command Executed: ${command._state.triggers[0]}`)
			.setDescription(`User ${user.displayName} executed a command, this is the command log for that interaction with the bot!`)
			.setThumbnail(user.user.displayAvatarURL())
			.setAuthor(`${user.displayName} (${user.user.tag})`, user.user.displayAvatarURL())
			.addFields(
				{ name: 'Command Name:', value: command._state.triggers[0], inline: true },
				{ name: 'Stage', value: stage, inline: true },
				{ name: 'Command Description: ', value: command._state.description, inline: true },
				{ name: 'Command Usage:', value: `${message.custom.user}${command._state.examples[0]}`, inline: true },
				{ name: 'Args Provided:', value: args.length > 0 ? `\`\`\`${args.join(', ')}\`\`\`` : 'None Given', inline: true },
				{ name: 'Channel:', value: message.channel, inline: true },
				{ name: 'User ID:', value: user.id, inline: true },
				{ name: 'Users Highest Rank: ', value: user.roles.highest, inline: true },
				// { name: 'Required Permissions:', value: roles.length > 0 ? roles.join(', ') : 'None on this server!', inline: true },
				{ name: 'Outcome:', value: outcome, inline: true },
			)
			.setTimestamp();

		if (message.guild.id === client.custom.config.get('staff')) {
			client.guilds.cache.get(client.custom.config.get('staff')).channels.cache.get(client.custom.config.get('stafflogslog')).send(embed);
		}
		else if (message.guild.id === client.custom.config.get('public')) {
			client.guilds.cache.get(client.custom.config.get('public')).channels.cache.get(client.custom.config.get('publogs')).send(embed);
		}
	}
}

module.exports = {
	Service: utilityService,
};

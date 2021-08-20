const { oneLine } = require('common-tags');
const Discord = require('discord.js');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['birthday'],
			description: oneLine`
			The birthday master command!`,
			options: {
				permissions: {
					roles: [],
					users: [],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['birthday <subcommand> <args>'],
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	errorEmbed(err) {
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle(`⛔ Err: \`${err}\``);

		return embed;
	}

	successEmbed(msg) {
		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`✅ \`${msg}\``);

		return embed;
	}

	helpEmbed() {
		const embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle('ℹ️ Birthday Help')
			.setDescription(':white_small_square: `/birthday setup DD MM YYYY` This would allow you to setup your birthday!\n:white_small_square: `/birthday info` Give you information on your birthday if you have one entered\n:white_small_square: `/birthday preview` Preview your birthday announcement\n:white_small_square: `/birthday setImage <image>` Sets your birthday image to any you want bear in mind some gifs don\'t work\n:white_small_square: `/birthday setMessage <message>` This would allow you to set yourself a birthday message\n:white_small_square: `/birthday clear` Removes **ALL** of your birthday info from the bot and its database');
		return embed;
	}

	async pre(client, message, args) {
		// const [Commands] = await client.database.models.Commands.findOrCreate({
		// 	where: {
		// 		GuildId: message.guild.id,
		// 		command_name: this._state.triggers[0],
		// 	},
		// });
		return true;
	}

	async register(slashInstance) {
		const data = new slashInstance()
			.setName('birthday')
			.setDescription('This is the birthday command add no subcommand for help!')
			.addStringOption(option =>
				option
					.setName('setting')
					.setDescription('What would you like to do?'));
		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		await message.delete();
		await message.channel.send(args.join(' '));
	}

	async slash(client, interaction) {
		function isValidDate(d) {
			return d instanceof Date && !isNaN(d);
		}

		const entry = await client.DB.queries.getBirthday(interaction.user.id);

		if (interaction.options._hoistedOptions[0] === undefined) {
			return interaction.reply({ embeds: [ this.helpEmbed() ] });
		}

		const args = interaction.options._hoistedOptions[0].value.split(' ');
		const command = args.shift().toLowerCase();

		if (command === 'setup') {
			if (entry.length > 0) return interaction.reply({ embeds: [ this.errorEmbed('You already have a birthday setup run /birthday clear to wipe it') ] });
			if (args.length === 3) {
				const date = new Date(`${args[2]}/${args[1]}/${args[0]}`);
				if (isValidDate(date)) {
					await client.DB.queries.addBirthday(interaction.user.id, args[0], args[1], args[2]);
					return interaction.reply({ embeds: [ this.successEmbed('Setup your birthday run /birthday info too see its details') ] });
				}
				else {
					return interaction.reply({ embeds: [ this.errorEmbed('Please supply valid date E.G. 20 01 2005') ] });
				}
			}
			else {
				return interaction.reply({ embeds: [ this.errorEmbed('Please supply your DOB in the format DD MM YYYY E.G. 20 01 2005') ] });
			}
		}
		else if (command === 'info') {
			if (entry.length === 1) {
				const name = entry[0].name === 'DISCORD_USER' ? `${interaction.user.username}'s` : `${entry[0].name}'s`;

				const embed = new Discord.MessageEmbed()
					.setColor('BLUE')
					.setTitle(`${name} Birthday Info`)
					.setDescription('Find below all the info that I have on your birthday and its announcement.')
					.addField('Bithday User:', `<@${entry[0].id}>`, true)
					.addField('Your Birthday Message:', `${entry[0].message}`, true)
					.addField('Combined:', `\`${entry[0].day}/${entry[0].month}/${entry[0].year}\``, true)
					.addField('Day:', `\`${entry[0].day}\``, true)
					.addField('Month:', `\`${entry[0].month}\``, true)
					.addField('Year:', `\`${entry[0].year}\``, true)
					.setImage(`${entry[0].img}`);

				return interaction.reply({ embeds: [ embed ] });
			}
			else {
				return interaction.reply({ embeds: [ this.errorEmbed('You need to setup your birthday before you can see info on it!') ] });
			}

		}
		else if (command === 'preview') {
			const embed = new Discord.MessageEmbed()
				.setColor('#f5abff')
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
				.setImage(entry[0].img)
				.setTitle(`Happy Birthday ${entry[0].name === 'DISCORD_USER' ? interaction.user.username : entry[0].name}!`)
				.setDescription(entry[0].message)
				.setTimestamp();

			return interaction.reply({ embeds: [ embed ] });
		}
		else if (command === 'clear' || command === 'reset' || command === 'wipe') {
			await client.DB.queries.delBirthday(interaction.user.id);
			return interaction.reply({ embeds: [ this.successEmbed('Removed your birthday from the database (if there was one) to add it again run /birthday setup') ] });
		}
		else if (command === 'setimage' || command === 'image') {
			if (entry.length === 1) {
				if (args.length === 0) {
					return interaction.reply({ embeds: [ this.errorEmbed('You need to supply a image URL to update the image: /birthday setImage https://image.com') ] });
				}
				else {
					if (!args[0].match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)) return interaction.reply({ embeds: [ this.errorEmbed('You need to supply a valid image url: /birthday setImage https://image.com') ] });
					await client.DB.queries.updateBirthdayImage(interaction.user.id, args[0]);
					if (args[0].length < 256) {
						return interaction.reply({ embeds: [ this.successEmbed(`Updated your birthday image to: ${args[0]}`) ] });
					}
					else {
						return interaction.reply({ embeds: [ this.successEmbed('Successfully updated your birthday image! Do /birthday info to view it') ] });
					}
				}
			}
			else {
				return interaction.reply({ embeds: [ this.errorEmbed('You need to setup your birthday before you can change its image!') ] });
			}
		}
		else if (command === 'setMessage' || command === 'message') {
			if (entry.length === 1) {
				if (args.length < 2) {
					return interaction.reply({ embeds: [ this.errorEmbed('You need to have a birthday message longer than 2 words!') ] });
				}
				else {
					await client.DB.queries.updateBirthdayMessage(interaction.user.id, args.join(' '));
					if (args.join(' ').length < 256) {
						return interaction.reply({ embeds: [ this.successEmbed(`Updated your birthday message to: ${args.join(' ')}`) ] });
					}
					else {
						return interaction.reply({ embeds: [ this.successEmbed('Successfully updated your birthday message! Do /birthday info to view it') ] });
					}
				}
			}
			else {
				return interaction.reply({ embeds: [ this.errorEmbed('You need to setup your birthday before you can change its message!') ] });
			}
		}
		else {
			return interaction.reply({ embeds: [ this.helpEmbed() ] });
		}
	}

}

module.exports = {
	Command,
};

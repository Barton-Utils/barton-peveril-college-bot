const { oneLine } = require('common-tags');
const clean = require('../../../utility/functions/clean');
const fs = require('fs');
const Discord = require('discord.js');
const ms = require('ms');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['eval'],
			description: oneLine`
			This is a command which allows code to be executed through discord DANGER`,
			options: {
				permissions: {
					roles: [],
					users: ['436876982794452992'],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: true,
				},
			},
			examples: ['say <args>'],
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
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
			.setName('eval')
			.setDescription('Eval a section of code')
			.addStringOption(option =>
				option
					.setName('code')
					.setDescription('The code to be evaled'));

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		const start = Date.now();

		try {
			const code = args.join(' ');
			let evaled = await eval(code);

			if (typeof evaled !== 'string') {evaled = await require('util').inspect(evaled);}

			await fs.writeFileSync(`./logs/eval/${start}-dump.log`, clean(evaled));

			const duration = Date.now() - start;

			const out = `\`\`\`xl\n${clean(evaled)}\`\`\``;

			const successEmbed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Eval Success')
				.setDescription(`Your query has been successfully executed. Time for code execution: **${ms(duration)}**`)
				.addField('Output:', out.length > 1024 ? '``` Dump was too large to display see attached file for more details.```' : out)
				.setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			if (out.length > 1024) {
				await message.channel.send({ embeds: [ successEmbed ] });
				await message.channel.send({ files: [ `./logs/eval/${start}-dump.log` ] });
			}
			else {
				await message.channel.send({ embeds: [ successEmbed ] });
			}

		}
		catch (err) {
			fs.writeFileSync(`./logs/eval/${start}-dump.log`, clean(err).toString());

			const out = `\`\`\`xl\n${clean(err)}\`\`\``;

			const errEmbed = new Discord.MessageEmbed()
				.setColor('RED')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Eval Error')
				.setDescription('Your query failed to successfully eval. Please see reason below, try not to have failing eval code it could cause issues.')
				.addField('Output:', out.length > 1024 ? '``` Dump was too large to display see attached file for more details.```' : out)
				.setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			if (out.length > 1024) {
				await message.channel.send({ embeds: [ errEmbed ] });
				await message.channel.send({ files: [ `./logs/eval/${start}-dump.log` ] });
			}
			else {
				await message.channel.send({ embeds: [ errEmbed ] });
			}
		}
	}

	async slash(client, interaction) {
		await interaction.reply({ content:'Funny thing is your not allowed to use this :D', ephemeral: false });
	}

}

module.exports = {
	Command,
};

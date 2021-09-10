const { oneLine } = require('common-tags');
const Discord = require('discord.js');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['lock', 'mute'],
			description: oneLine`
			A command that allows you to mute a channel`,
			options: {
				permissions: {
					roles: ['875738513511956510'],
					users: ['436876982794452992'],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['lock true/false'],
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
			.setName('lock')
			.setDescription('Lock a channel');

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		const embedSuc = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('Channel Unlocked')
			.setDescription(`<#${message.channel.id}> has been unlocked by <@${message.author.id}>!`)
			.setFooter('Channel Lock')
			.setTimestamp()
						
		const embedLoc = new Discord.MessageEmbed()
			.setColor('RED')
			.setTitle('Channel Locked')
			.setDescription(`<#${message.channel.id}> has been locked by <@${message.author.id}>!`)
			.setFooter('Channel Lock')
			.setTimestamp()

		const member = message.channel.guild.roles.cache.get(process.env.MEMBER_ROLE);

		const perms = message.channel.permissionOverwrites.resolve(process.env.MEMBER_ROLE);

		if (args[0] === 'true' || args[0] === "1" || args[0] === "yes" || args[0] === "enable") {
			await message.channel.permissionOverwrites.edit(member, {
				'SEND_MESSAGES': false,
			})
			message.channel.send({ embeds: [embedLoc] })
		}
		else if (args[0] === 'false' || args[0] === "0" || args[0] === "no" || args[0] === "disable") {
			await message.channel.permissionOverwrites.edit(member, {
				'SEND_MESSAGES': true,
			})
			message.channel.send({ embeds: [embedSuc] })
		}
		else if (perms.allow.bitfield !== 3072n) {
			await message.channel.permissionOverwrites.edit(member, {
				'SEND_MESSAGES': true,
			})

			message.channel.send({ embeds: [embedSuc] })
		}
		else {
			await message.channel.permissionOverwrites.edit(member, {
				'SEND_MESSAGES': false,
			})
			message.channel.send({ embeds: [embedLoc] })
		}


	}

	async slash(client, interaction) {
		await interaction.reply({ content:'Funny thing is your not allowed to use this :D', ephemeral: false });
	}

}

module.exports = {
	Command,
};

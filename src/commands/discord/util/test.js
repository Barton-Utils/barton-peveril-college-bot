const { oneLine } = require('common-tags');
const Discord = require('discord.js')
class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['test'],
			description: oneLine`
			This is a command that is used for development and testing purposes not to be executed in production or by non-devs.`,
			options: {
				permissions: {
					roles: ['875741719050715166'],
					users: [],
				},
				restrictions: {
					unstable: true,
					hidden: true,
					dangerous: true,
				},
			},
			examples: ['test <args>'],
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
			.setName('test')
			.setDescription('Command used for development and testing purposes not to be executed in production or by non-devs.')
			.addStringOption(option =>
				option
					.setName('args')
					.setDescription('arguments that may or may not be required'));

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}	

	async execute(client, chain, message, args) {
		message.channel.send({ embeds: [ new Discord.MessageEmbed()
			.setTitle('Welcome to the Discord!')
			.setColor('BLUE')
			.setDescription('Welcome to the unofficial Barton Peveril College Discord server. This is the only piece of discord verification you will have to do however you will need to do it in order to gain access to the rest of the discord server and there’s no way around it! If you need help that’s not explained by the steps below contact a admin. If your confused, please follow the steps below.')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.addField('How to Verify:', ':one: Make sure you have access to your barton email account.\n\n:two: Copy your email address (E.G. 21RP0909@barton.ac.uk) and paste it into this channel.\n\n:three: If your email was correct you should get a confirmation message if not **READ** the error message.\n\n:four: Check your barton email, in there should be a email with the subject `Discord Account Verification` open it and click the link.\n\n:five: This should take you to a confirmation site, if you see a confirmed message then your all set to go!\n\n\n_If you get an error message then send it to <@436876982794452992> and he\'ll give you a hand!_')
			.setTimestamp()
			.setFooter('Barton Peveril College Discord', client.user.displayAvatarURL({ dynamic: true}))
		] })
	}

	async slash(client, interaction) {
		await interaction.reply({ content:'Welcome to testing!', ephemeral: true });
		await interaction.followUp({ content: 'Testing stuff!', ephemeral: true });
	}

}

module.exports = {
	Command,
};

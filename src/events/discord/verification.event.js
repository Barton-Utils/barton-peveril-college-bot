const Discord = require('discord.js');
const nodemailer = require('nodemailer');

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

	errorEmbed(err) {
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setDescription(`**⛔ ${err}**`)
			.setFooter('This message will self descruct in 10 seconds');

		return embed;
	}

	successEmbed(msg) {
		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription(`**✅ ${msg}**`)
			.setFooter('This message will self descruct in 10 seconds');

		return embed;
	}

	async nodeMail(message) {
		// object fudgeing due to scope issues
		const client = this.client;
		const embeds = {
			errorEmbed: this.errorEmbed,
			successEmbed: this.successEmbed,
		};

		const UUID = client.UUID();

		this.client.DB.queries.addVerificationCode(message.author.id, UUID, message.content.trim());

		// Send email and all that jazz
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOpt = {
			from: process.env.EMAIL_USER,
			to: message.content.trim(),
			subject: 'Discord Account Verification',
			html: `<p>To link your email and discord account click <a href="http://81.110.1.132:8080/${UUID}">here</a></p>`,
		};

		transporter.sendMail(mailOpt, function(err, info) {
			if (err) {
				client.logger.error('Verification Server | Mail Err:', err);
				message.channel.send({ content: `<@${message.author.id}>,`, embeds: [ embeds.errorEmbed(err) ] }).then(msg => {
					setTimeout(() => msg.delete(), 10000);
				});
			}
			else {
				message.channel.send({ content: `<@${message.author.id}>,`, embeds: [ embeds.successEmbed('Success, please click the link that was sent to your barton email to gain access to the rest of the server!') ] }).then(msg => {
					setTimeout(() => msg.delete(), 10000);
				});
				client.logger.info(`Verification Server | Mail Sent: ${info.response}`);
			}
		});

	}

	async process(client, chain, message) {
		if (message.channel.type === 'DM') return;
		if (message.author.bot) return;
		if (message.channel.id !== process.env.VERIFICATION_CHANNEL) return;

		await message.delete();

		if (message.content.trim().split(' ').length > 1) {
			message.channel.send({ content: `<@${message.author.id}>,`, embeds: [ this.errorEmbed('Please only send your email in this channel it\'s not for general conversation!') ] }).then(msg => {
				setTimeout(() => msg.delete(), 10000);
			});
		}
		else if (message.content.trim().split(' ').length === 1) {
			if (message.content.match(/^21\w{2}\d{4}@barton.ac.uk$/gi)) {
				const doesMemberExist = await client.DB.queries.getMemberByEmail(message.content)

				if (doesMemberExist.length !== 0) {
					message.channel.send({ content: `<@${message.author.id}>,`, embeds: [ this.errorEmbed('The email you supplied is already in use please contact an admin if this is a mistake!') ] }).then(msg => {
						setTimeout(() => msg.delete(), 10000);
					});
				}
				else {
					// NODEMAILER
					await this.nodeMail(message);
				}

			}
			else {
				message.channel.send({ content: `<@${message.author.id}>,`, embeds: [ this.errorEmbed('Please use your school email address (E.G. 21RP0909@barton.ac.uk)') ] }).then(msg => {
					setTimeout(() => msg.delete(), 10000);
				});
			}
		}

		return true;
	}
}

module.exports = {
	Event,
};

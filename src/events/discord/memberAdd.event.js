const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');
const Discord = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'guildMemberAdd',
			},
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async pre(client, member) {
		return true;
	}

	async update(parent) {
		this._state.persist = {
			cache: (new KeyvBuilder(Driver.MemoryStore)),
		};
	}

	async process(client, chain, member) {
		// Define assets and create canvas
		registerFont('src/assets/Bitter-Regular.ttf', { family: 'Bitter' });
		registerFont('src/assets/Bitter-Bold.ttf', { family: 'Bitter-Bold' });
		const canvas = createCanvas(800, 200);
		const ctx = canvas.getContext('2d');
		const userName = member.user.username;
		const userAvatar = member.user.displayAvatarURL({ format: 'png' });
		const memberCount = `${member.guild.memberCount}`;

		// Select appropriate font based on used characters
		/* let usernameFont
		if (/(^[A-zÀ-ÿ0-9 $-/:-?{-~!"^_`\[\]])\w+/gi.test(userName)) usernameFont = "37.5px Bitter-Bold"
		else usernameFont = "37.5px sans-serif"*/

		loadImage('src/assets/joinBackground.png').then(bg => {
			let nameWidth;

			// GENERAL
			// Add background and set basic styling
			ctx.drawImage(bg, 0, 0, 800, 200);
			ctx.fillStyle = 'white';

			// TEXT
			// Measure text widths
			ctx.font = '37.5px Bitter';
			const welcome = ctx.measureText('Welcome ');
			ctx.font = '37.5px sans';
			const name = ctx.measureText(userName);
			if (name.width > (550 - welcome.width)) nameWidth = (550 - welcome.width);
			else nameWidth = name.width;

			// Draw 'Welcome ' and '!'
			ctx.font = '37.5px Bitter';
			ctx.fillText('Welcome ', 200, 92.5);
			ctx.fillText('!', (200 + welcome.width + nameWidth), 92.5);

			// Draw username
			ctx.font = '37.5px sans';
			ctx.fillText(userName, (200 + welcome.width), 92.5, (550 - welcome.width));

			// Draw member count
			ctx.font = '30px Bitter';
			ctx.fillText('You\'re member #' + memberCount, 200, 132.5);

			// ICON
			// Draw a circle for the image to go into
			ctx.beginPath();
			ctx.arc(100, 100, 75, 0, 2 * Math.PI);
			ctx.closePath();

			// Put the image in the circle
			loadImage(userAvatar).then(async userPic => {
				ctx.clip();
				ctx.drawImage(userPic, 25, 25, 150, 150);
				ctx.restore();

				// OUTPUT
				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${member.user.username} join.png`);
				await member.guild.channels.cache.get(process.env.WELCOME_CHANNEL).send({ content: `${member.user} just joined. Welcome! 🎉`, files: [attachment] });
				// join-leave
			});
		});
		if (!member.user.bot) {
			member.send(`Hey there and thanks for joining **${member.guild.name}**! We hope you have fun on our server!`)
				.catch(() => client.logget.alert(`Couldn't DM user ${member.user.tag}, probably because they have DMs off`));
		}
	}

	async post(client, guild, member) {
		return true;
	}
}
module.exports = {
	Event,
};

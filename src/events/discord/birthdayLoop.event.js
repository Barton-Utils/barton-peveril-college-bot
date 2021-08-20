const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');
const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'ready',
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

	birthdayEmbed(birthObj, member) {
		const embed = new Discord.MessageEmbed()
			.setColor('#f5abff')
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
			.setImage(birthObj[0].img)
			.setTitle(`Happy Birthday ${birthObj[0].name === 'DISCORD_USER' ? member.displayName : birthObj[0].name}!`)
			.setDescription(birthObj[0].message)
			.setTimestamp();
		return embed;
	}

	async process(client, chain) {
		setInterval(async () =>{
			// Work out todays date and then assign the date num and month num for fetching fro the db
			const today = new Date();
			const month = today.getMonth() + 1;
			const day = today.getDate();

			// Get birthday entrys for today
			const ids = await client.DB.queries.getSpecificBirthdayIDS(day, month);

			// Remove roles from non birthday people
			client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.forEach(async member => {
				if (member.roles.cache.has(process.env.BIRTHDAY_ROLE) && !ids.includes(member.id)) {
					await member.roles.remove(process.env.BIRTHDAY_ROLE);
					await member.setNickname(member.displayName.split(' 🍰')[0]);
					await client.user.setActivity('over you dumbasses', {
						type: 'WATCHING',
					});
				}
			});

			if (ids.length !== 0 && ids.length === 1) {
				const member = await client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.get(ids[0]);
				if (member.displayName.includes('🍰')) return;
				await member.roles.add(process.env.BIRTHDAY_ROLE);
				await client.user.setActivity(`${member.displayName}'s birthday party!`, {
					type: 'WATCHING',
				});
				await member.setNickname(`${member.displayName} 🍰`);
				await member.guild.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL).send(`<@${member.id}>`);
				const msg = await member.guild.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL).send({ embeds : [this.birthdayEmbed(await client.DB.queries.getBirthday(ids[0]), member)] });
				msg.react('🍰');
			}
			else if (ids.length !== 0 && ids.length > 1) {
				await client.user.setActivity('birthday parties!', {
					type: 'WATCHING',
				});
				ids.forEach(async (id) => {
					const member = await client.guilds.cache.get(process.env.COLLEGE_GUILD).members.cache.get(id);
					if (member.displayName.includes('🍰')) return;
					await member.roles.add(process.env.BIRTHDAY_ROLE);
					await member.setNickname(`${member.displayName} 🍰`);
					await member.guild.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL).send(`<@${member.id}>`);
					const msg = await member.guild.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL).send({ embeds : [this.birthdayEmbed(await client.DB.queries.getBirthday(id), member)] });
					await msg.react('🍰');
				});
			}

		}, 1800000);
		return true;
	}
}

module.exports = {
	Event,
};

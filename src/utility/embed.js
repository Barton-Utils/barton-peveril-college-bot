const { MessageEmbed } = require('discord.js');

class EmbedFactory {
	constructor(edit) {
		this._state = null;
		if (edit !== undefined) {
			this._state = new MessageEmbed(edit);
			this._fields = [];
		}
		else {
			this._state = new MessageEmbed();
			this._fields = [];
		}
	}

	author(name, iconURL, url) {
		this._state.setAuthor(name, iconURL, url);
		return this;
	}

	title(value) {
		this._state.setTitle(value);
		return this;
	}

	description(value) {
		if (typeof value === 'object' && value.length > 0) {
			value = value.join('\n');
		}
		this._state.setDescription(value);
		return this;
	}

	addField(name, value, inline) {
		if (name === undefined || value === undefined) return this;
		this._fields.push({ name, value, inline: inline === true });
		return this;
	}

	setField(position, name, value, inline) {
		if (typeof position !== 'number' || position < 0) return this;
		if (name === undefined || value === undefined) return this;
		this._fields[position] = { name, value, inline: inline === true };
	}

	multiField(name, value, format) {
		if (name === undefined || value === undefined) return this;

		const chunks = [];
		const parts = value.split(/^(.*)\n?$/gim);

		let concat = '';
		for (const part of parts) {
			if ((concat + part).length < 1024) {
				concat = concat + part;
			}
			else {
				chunks.push(concat);
				concat = '' + part;
			}
		}
		chunks.push(concat);

		for (let chunk of chunks) {
			if (format !== undefined) {
				chunk = format.replace(/x0repl/gim, chunk);
			}
			if (chunk.length > 8) this.addField(name, chunk, false);
		}
		return this;
	}

	thumbnail(value) {
		if (value === undefined) {
			value = 'https://cdn.discordapp.com/attachments/783405548032884798/822566035671482388/discord.png';
		}
		this._state.setThumbnail(value);
		return this;
	}

	image(value) {
		if (value === undefined || value === undefined) return this;
		this._state.setImage(value);
		return this;
	}

	footer(value) {
		if (value === undefined) {
			value = 'PLACEHOLDER TO BE ADDED - http://discord.northern.network';
		}
		this._state.setFooter(value);
		return this;
	}

	color(hex) {
		if (hex === undefined) {
			hex = '7a3db8';
		}
		this._state.setColor(hex);
		return this;
	}

	timestamp(date) {
		if (date === undefined) date = new Date();
		this._state.setTimestamp(date);
		return this;
	}

	done() {
		if (this._fields.length > 0) {
			this._state.addFields(this._fields);
		}
		return this._state;
	}
}

module.exports = {
	EmbedFactory,
};

// Import Libraries
const Discord = require('discord.js');

const { walk } = require('cloudlink-hv/lib/utility/fs/walk');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

const chalk = require('chalk');
const chalkTable = require('chalk-table');
const path = require('path');
const config = require('./utility/config');
const logger = require('./utility/functions/logger');

/**
 * Bootstrap the Project. This is a feature of the Node.js Template Environment, please do not remove this function.
 *
 * If you use a class for entering your project, please initialize that class inside this function to be called when the bootstrap and injectors are complete.
**/
async function start() {
	logger.info('Starting project...');
	// Initialize the Client
	this.controller = new ClientAPI();
	await this.controller.initializeServices();
	this.controller.initialize();
}

// Create the Client API
class ClientAPI {
	constructor() {
		// Initialize Internal Sharding
		this.client = new Discord.Client({
			shards: 'auto',
			retryLimit: 3,
			partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
			disabledEvents: ['typingStart'],
			intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
		});

		this.client.created_at = new Date();

		// Initialize Cache Spaces
		this.commands = new Discord.Collection();

		this.commandList = [];
		this.aliasList = [];

		this.basePath = path.resolve(__dirname, '../');

		this.client.logger = logger;
		this.client.version = require(path.resolve(path.join(this.basePath, 'package.json'))).version;
		this.package = require(path.resolve(path.join(this.basePath, 'package.json')));
	}

	async determineEnvironment() {
		this.client.custom = { ENV: process.env.NODE_ENV, get: config.fetchValue, config: config };
	}

	async initializeServices() {
		await this.determineEnvironment();
		const files = await walk(require('path').join(__dirname, 'services'));

		const history = [];
		let autoInc = 1;

		const options = {
			leftPad: 2,
			columns: [
				{ field: 'id', name: chalk.cyan('ID') },
				{ field: 'service', name: chalk.magenta('Service') },
				{ field: 'status', name: chalk.redBright('Status') },
			],
		};
		const serviceFiles = files.files.sort((x, y) => {
			return x.name === 'logger.service.js' ? -1 : y === 'logger.service.js' ? 1 : 0;
		});

		const servicePromises = [];
		this.client.services = {};

		for (const file of serviceFiles) {
			const { Service } = require(file.exact);

			const service = new Service(this.client, path.join(__dirname, ''), path.join(__dirname, '..', ''));

			if(service.name === 'database-service') {
				const result = await service.init();
				const databaseResult = result.DB();
				if (!this.client.services[service.name.split('.').shift()]) {
					this.client.services[service.name.split('.').shift()] = databaseResult;
				}
				this.client.database = databaseResult;

				// sync and update
				this.client.logger.info(`Starting Syncing Database for environment ${this.client.custom.ENV}`);
				await this.client.database.sequelize.sync();
				await this.client.database.setup(this.client);
				this.client.logger.info(`Finished Syncing Database for environment ${this.client.custom.ENV}`);

				this.client.logger.info(`Adding Static Data to Database for environment ${this.client.custom.ENV}`);
				await this.addStaticData();
				this.client.logger.info(`Finished adding Static Data to Database for environment ${this.client.custom.ENV}`);
			}
			else {
				servicePromises.push(service.init());
			}
		}
		const serviceResults = await Promise.all(servicePromises).catch(err => {
			console.error(err);
		});
		const serviceRequests = [];
		if (serviceResults !== undefined && Array.isArray(serviceResults)) {
			for (const result of serviceResults) {
				if (result.name.split('.').shift() !== 'database') {
					this.client.services[result.name.split('.').shift()] = result;
				}
				history.push({ id: chalk.green(autoInc), service: chalk.green(result.name.split('.').shift()), status: chalk.green('PASS') });
				autoInc += 1;

				if (result.pre) {
					serviceRequests.push(result.pre());
					continue;
				}
				if (result.process) {
					serviceRequests.push(result.process(this.client));
					continue;
				}

				if (result.post) {
					serviceRequests.push(result.post());
				}
			}
		}

		let serviceExecution = null;
		if (serviceRequests.length >= 1) {
			serviceExecution = await Promise.all(serviceRequests).catch(err => {
				this.client.logger.error(err);
				return null;
			});
		}
		if (serviceExecution !== null || serviceExecution !== undefined) {
			this.client.logger.error(serviceExecution);
		}

		const table = chalkTable(options, history);
		this.client.logger.alert(`\n${table}`);
	}

	/**
   * Add Static Data if not already in the database
   */
	// async addStaticData() {
	// 	const data = this.client.custom.config.get('guilds');
	// 	const keys = Object.keys(data);

	// 	for (const key of keys) {
	// 		const serverKey = this.client.custom.get(key);
	// 		await this.client.database.models.Guilds.findOrCreate({
	// 			where: {
	// 				id: serverKey,
	// 			},
	// 		});
	// 	}
	// }

	// async initializeSocket() {
	// 	await this.client.services.websocket.start();
	// }

	/**
   * Initializes the ClientAPI Lifecycle
   */
	async initialize() {
		this.client.logger.info(`Initializing Entire Bot for ${process.env.NODE_ENV}`);

		// Register Events
		await this.register().catch((err) => {
			this.client.logger.error(err);
			process.exit(-1);
		});

		// Register Commands
		await this.load().catch((err) => {
			this.client.logger.error(err);
			process.exit(-1);
		});

		// Authenticate Gateway
		await this.login().catch((err) => {
			this.client.logger.error(err);
			process.exit(-1);
		});
	}

	/**
   * Register Events to the Client
   */
	async register() {
		this.client.logger.info('Loading all events...');
		const files = await walk(require('path').resolve(__dirname, './events/'));

		const history = [];
		let autoInc = 1;

		const options = {
			leftPad: 2,
			columns: [
				{ field: 'id', name: chalk.cyan('ID') },
				{ field: 'folder', name: chalk.yellow('Folder') },
				{ field: 'file', name: chalk.magenta('File') },
				{ field: 'triggers', name: chalk.green('Triggers') },
				{ field: 'status', name: chalk.redBright('Status') },
			],
		};
		for (const file of files.files) {

			try {
				const { Event } = require(file.exact);

				// Init Event and Persistent Data
				const event = new Event(this, this.client);
				await event.update();

				if (file.folder === 'discord') {
					// Assign Event to Discord Client

					let eventClient = null;
					if (event._state.prepend !== undefined && event._state.prepend) {
						eventClient = 'prependListener';
					}
					else {
						eventClient = 'on';
					}
					this.client[eventClient](event._state.options.event, async (...args) => {

						// this.client.logger.info('Processing Event State: ' + event._state.options.event);

						let pre = null;
						if (event.pre !== undefined) {
							pre = await event.pre(this.client, ...args).catch((err) => {
								this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/PRE/${event._state.options.event})`, err);
								pre = false;
							});
						}
						if (pre === false) {
							if (event.finally !== undefined) {
								await event.finally(this.client, pre, ...args).catch((err) => {
									this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/PROCESS/${event._state.options.event})`, err);
								});
							}
							return;
						}

						let execute = null;
						await event.process(this.client, pre, ...args).catch((err) => {
							this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/PROCESS/${event._state.options.event})`, err);
							execute = false;
						});
						if (execute === false) {
							if (event.finally !== undefined) {
								await event.finally(this.client, pre, ...args).catch((err) => {
									this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/PROCESS/${event._state.options.event})`, err);
								});
							}
							return;
						}

						if (event.post !== undefined) {
							await event.post(this.client, execute, ...args).catch((err) => {
								this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/POST/${event._state.options.event})`, err);
							});
						}

						if (event.finally !== undefined) {
							await event.finally(this.client, execute, ...args).catch((err) => {
								this.client.logger.error(`[Inflight] Guardian Exception (EVENT_PROC/PROCESS/${event._state.options.event})`, err);
							});
						}
					});
					history.push({ id: chalk.green(autoInc), folder: chalk.green(file.folder), file: chalk.green(file.name), triggers: chalk.green(event._state.options.event), status: chalk.green('PASS') });
				}
				else if(file.folder === 'websocket') {
					if (this.client.services[file.folder].eventPath === undefined) {
						this.client.services[file.folder].eventPath = file.directory;
					}
					this.client.services[file.folder].eventStore.events.push(event);
					history.push({ id: chalk.green(autoInc), folder: chalk.green(file.folder), file: chalk.green(file.name), triggers: chalk.green(event._state.options.event), status: chalk.green('PASS') });
				}
				else if (file.folder === 'ws') {
					const tmpName = 'websocket';
					if (this.client.services[tmpName].wsEvent.eventPath === undefined) {
						this.client.services[tmpName].wsEvent.eventPath = file.directory;
					}
					this.client.services[tmpName].wsEvent.eventStore.events.push(event);
					history.push({ id: chalk.green(autoInc), folder: chalk.green(file.folder), file: chalk.green(file.name), triggers: chalk.green(event._state.options.event), status: chalk.green('PASS') });
				}
				else {
					// Event something else
					console.log(file.folder, file.name);
				}
			}
			catch (err) {
				history.push({ id: chalk.red(autoInc), folder: chalk.red(file.folder), file: chalk.red(file.name), triggers: chalk.red(null), status: chalk.red('FAIL') });
				this.client.logger.error(`${file.name} failed to load: ${err.message}`);
				console.log(err);
			}
			autoInc++;
		}

		// await this.initializeSocket();
		const table = chalkTable(options, history);
		this.client.logger.alert(`\n${table}`);
	}

	/**
   * Register Commands to the Client
   */
	async load() {
		this.client.logger.info('Loading commands...');
		const files = await walk(require('path').resolve(__dirname, './commands/'));

		files.files = files.files.map(val => {
			if (val.parent === undefined) {
				val.parent = val.directory.replace(path.join(__dirname, './commands/'), '').split(path.sep).shift();
			}
			return val;
		});
		const history = [];
		let autoInc = 1;

		const options = {
			leftPad: 2,
			columns: [
				{ field: 'id', name: chalk.cyan('ID') },
				{ field: 'file', name: chalk.magenta('File') },
				{ field: 'triggers', name: chalk.green('Triggers') },
				{ field: 'type', name: chalk.yellow('Type') },
				{ field: 'status', name: chalk.redBright('Status') },
			],
		};
		if (this.client.types === undefined) {
			this.client.types = {};
		}

		const slashCommands = [];
		const slashCommandNames = [];

		for (const file of files.files) {
			try {
				const { Command } = require(file.exact);

				// Init Command and Persistent Data
				this.client.logger.info(`Initalizing Command Slash Entry for ${file.name} in ${file.parent.toUpperCase()}/${file.folder.toUpperCase()}`);

				const command = new Command(this, this.client);

				const cmdReg = await command.register(SlashCommandBuilder);

				slashCommands.push(cmdReg);
				slashCommandNames.push(cmdReg.name);

				if (file.folder === 'discord' || (file.parent !== undefined && file.parent === 'discord')) {
					const categoryType = file.exact.replace(require('path').resolve(__dirname, './commands/'), '').split(require('path').sep).filter((v) => v.trim().length !== 0).shift();
					const subCategoryType = file.exact.replace(require('path').resolve(__dirname, './commands/'), '').split(require('path').sep).filter((v) => v.trim().length !== 0)[1];

					if (this.client.types[categoryType.toUpperCase()] === undefined) {
						this.client.types[categoryType.toUpperCase()] = categoryType.toLowerCase();
					}
					command._state.type = categoryType.toUpperCase();
					const cmdName = command._state.triggers[0];
					this.commandList.push(cmdName);

					const cmdAliases = command._state.triggers.filter((v, i) => { return i !== 0; });
					for (const alias of cmdAliases) {
						this.aliasList.push(alias);
					}
					// Register to Command Index
					for (const trigger of command._state.triggers) {
						this.commands.set(trigger, command);
					}
					history.push({ id: chalk.green(autoInc), file: chalk.green(file.name), triggers: chalk.green(command._state.triggers.join(',')), type: chalk.green(`${command._state.type}-${subCategoryType.toUpperCase()}`), status: chalk.green('PASS') });
				}
				else {
					// Command something else
					console.log(file.folder, file.name);

				}
			}
			catch (err) {
				this.client.logger.error(err.stack);
				this.client.logger.error(`${file.name} failed to load: ${err.message}`);
				history.push({ id: chalk.red(autoInc), file: chalk.red(file.name), triggers: chalk.red(null), type: chalk.red(null), status: chalk.red('FAIL') });
			}
			autoInc++;
		}

		this.client.logger.alert(`Processing these global slash commands: ${slashCommandNames.join(', ').toUpperCase()}`);

		await rest.put(
			Routes.applicationGuildCommands('876869839300472835', '875736589836365864'),
			{ body: slashCommands },
		).catch(e => {
			console.log(e);
		});

		const table = chalkTable(options, history);
		this.client.logger.alert(`\n${table}`);
	}

	/**
        * Authenticate Client to Discord.js Gateway
    **/
	async login() {
		// Authenticate to Discord
		await this.client.login(process.env.TOKEN).catch((err) => {
			this.client.logger.error('client:auth_fail -> Failed to authenticate with Discord.js Gateway: ' + err.message);
			throw new Error('discord:gateway_auth_fail');
		});
	}
}

module.exports = start;

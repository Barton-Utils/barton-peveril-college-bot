require('dotenv').config();

class Launcher {
	/**
   * Bootstrap the Project. This is a feature of the Node.js Template Environment, please do not remove this function.
   */
	async bootstrap() {
		require('./src/assets/inject/json5');
		// JSON5 Specification Support <https://json5.org/>. Overwrites [JSON] Changes [require]
	}
}

/**
 * Bootstrap the Project. This is a feature of the Node.js Template Environment, please do not remove this function.
*/
async function main() {
	const launcher = new Launcher();
	await launcher.bootstrap().catch((err) => {
		console.error('init_vec:bootstrap_error', err);
		return process.exit(100);
	});
	await require('./src/initialize.js')(launcher).catch((err) => {
		console.error('init_vec:initialize_error', err);
		return process.exit(900);
	});
}

// Initialize the Project. Please do not remove this line or project WILL NOT reach the entrypoint.
main();

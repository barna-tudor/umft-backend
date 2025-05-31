const Pool = require("pg").Pool;
const pool = new Pool({
	                      user: "postgres",
	                      host: process.env.DB_HOST,
	                      database: process.env.DB,
	                      password: process.env.DB_PASS,
	                      port: process.env.DB_PORT,
	                      idleTimeoutMillis: 60 * 1000,
	                      max: 5
                      });

pool.on("connect", async (client) => {
	try {
		// Re-enable this line if running on a separate Schema than default
		//await client.query(`SET search_path TO ${process.env.DB_SCHEMA};`)
		console.log("Pool Client Connect");
	} catch (e) {
		console.error("Unexpected error on pool client connet: ", e);
	}
});

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client: ", err);
});

module.exports = {pool};
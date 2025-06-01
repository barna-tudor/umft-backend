require("dotenv").config();
const { ethers } = require("ethers");
const contractJson = require("../../artifacts/contracts/HealthLog.sol/HealthLog.json");

// Validate env vars
const { ETHERS_PROVIDER, ETHERS_PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
if (!ETHERS_PROVIDER || !ETHERS_PRIVATE_KEY || !CONTRACT_ADDRESS) {
	throw new Error("Missing environment variables for blockchain logging.");
}

const provider = new ethers.JsonRpcProvider(ETHERS_PROVIDER);
const wallet = new ethers.Wallet(ETHERS_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, wallet);

async function logAlertToBlockchain(patient_id, alert_type) {
	try {
		console.log("patient_id:", patient_id, typeof patient_id);
		console.log("alert_type:", alert_type, typeof alert_type);
		if (typeof patient_id !== "string" || typeof alert_type !== "string") {
			throw new Error("Invalid alert: patient_id and alert_type must be strings");
		}
		const tx = await contract.logEvent(patient_id, alert_type);
		await tx.wait();
		console.log(`[BLOCKCHAIN]:[SUCCESS]: ${patient_id} - ${alert_type}`);
	} catch (err) {
		console.error("[BLOCKCHAIN]:[ERROR]:", err);
	}
}


module.exports = { logAlertToBlockchain };

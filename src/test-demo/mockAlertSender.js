const axios = require("axios");


const API_ENDPOINT = "http://localhost:3000/api/alerts"; // Change if needed

const wards = ["1", "2", "3"];
const rooms = ["1", "2", "3"];
const beds = ["1", "2", "3"];
const alertTypes = ["oxygen-saturation", "heart-rate", "blood-pressure", "temperature"];

function getRandomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomAlert() {
	return {
		ward: getRandomItem(wards),
		room: getRandomItem(rooms),
		bed: getRandomItem(beds),
		alert_type: getRandomItem(alertTypes),
		patient_id: `019727c7-532d-7517-b949-5ecf488917ec`
	};
}

async function sendAlert() {
	const alert = generateRandomAlert();
	try {
		const res = await axios.post(API_ENDPOINT, alert);
		console.log("Sent alert:", alert);
	} catch (err) {
		console.error("Failed to send alert:", err.message);
	}
}

// Send one alert every 5 seconds
setInterval(sendAlert, 5000);

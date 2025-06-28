import axios from "axios";

export const registerBedside = async () => {
    const response = await axios.post("http://localhost:3000/api/registerBedsideComputer", {
        setupAPIKey: process.env.REACT_APP_SETUP_API_KEY,
        ward_id: process.env.REACT_APP_WARD_ID,
        room_id: process.env.REACT_APP_ROOM_ID,
        bed_id: process.env.REACT_APP_ROOM_ID,
    });
    return response.data.apiKey
};

export const getChartData = async (projectId, period) => {
    return [{
        timestamp: Date.now() / 1000 - 7200,
        pulse: 72,
        SO2: 98,
        temperature: 36.7
    }, {timestamp: Date.now() / 1000 - 3600, pulse: 75, SO2: 97, temperature: 36.8}, {
        timestamp: Date.now() / 1000,
        pulse: 73,
        SO2: 96,
        temperature: 36.6
    }];
};

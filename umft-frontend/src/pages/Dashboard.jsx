import React, { useEffect, useState } from "react";
import { getChartData } from "../services/api";
import ChartCard from "../components/ChartCard";
import NotificationPanel from "../components/NotificationPanel";

function Dashboard() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("10s");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getChartData(1, period);
      setData(result);
      setAlerts([{ message: "Low oxygen detected", timestamp: Date.now() / 1000 }]);
    }
    fetchData();
  }, [period]);

  return (
    <div className="p-4 md:p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
      <NotificationPanel alerts={alerts} />
      <div className="mb-4">
        <label className="mr-2">Period:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="text-black p-1">
          <option value="7d">7 days</option>
          <option value="1m">1 month</option>
          <option value="6m">6 months</option>
          <option value="1y">1 year</option>
        </select>
      </div>
      <ChartCard title="Pulse" data={data} dataKey="pulse" />
      <ChartCard title="Oxygen (SO2)" data={data} dataKey="SO2" />
      <ChartCard title="Temperature" data={data} dataKey="temperature" />
    </div>
  );
}

export default Dashboard;

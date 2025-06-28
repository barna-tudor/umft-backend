import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function ChartCard({ title, data, dataKey }) {
  const formatted = data.map(item => ({
    ...item,
    date: new Date(item.timestamp * 1000).toLocaleTimeString()
  }));

  return (
    <div className="bg-white text-black p-4 rounded mb-6 shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formatted}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartCard;

import React from "react";

function NotificationPanel({ alerts }) {
  if (!alerts || alerts.length === 0) return <p>No notifications yet.</p>;

  return (
    <div className="bg-white text-black p-4 rounded shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Notification History</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li
            key={index}
            className={`p-2 rounded mb-1 ${index === 0 ? "bg-yellow-200 font-bold" : "bg-gray-100"}`}
          >
            {alert.message} — {new Date(alert.timestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPanel;

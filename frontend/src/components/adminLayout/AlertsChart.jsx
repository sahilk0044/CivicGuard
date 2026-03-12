import React, { useEffect, useState } from "react";
import axios from "axios";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const AlertsChart = () => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    const fetchChart = async () => {

      const res = await axios.get(
        "http://localhost:8000/api/admin/alerts-chart"
      );

      setChartData(res.data);

    };

    fetchChart();

  }, []);

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const counts = Array(7).fill(0);

  chartData.forEach(item => {
    counts[item._id - 1] = item.total;
  });

  const data = {
    labels: days,
    datasets: [
      {
        label: "Emergency Alerts",
        data: counts,
        backgroundColor: "#38bdf8"
      }
    ]
  };

  return (
    <div
      style={{
        width: "100%",
        minWidth: "0",
        padding: "20px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        boxSizing: "border-box"
      }}
    >

      <h5 style={{ marginBottom: "15px" }}>
        Weekly Emergency Alerts
      </h5>

      <div style={{ width: "100%", height: "300px" }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </div>

    </div>
  );
};

export default AlertsChart;
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
        flex:1,
        padding:"20px",
        background:"rgba(255,255,255,0.05)",
        borderRadius:"12px"
      }}
    >

      <h5>Weekly Emergency Alerts</h5>

      <Bar data={data} />

    </div>
  );
};

export default AlertsChart;
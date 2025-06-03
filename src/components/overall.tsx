import React from 'react';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import HeatMap from "react-heatmap-grid";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

const Overall = () => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);
    const [chartData, setChartData] = useState(null);
    const [vicinityData, setVicinityData] = useState(null);
    const [timeData, setTimeData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);


    const colors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)'
    ];

    useEffect(() => {
        fetch('http://localhost:8000/api/visuals/area', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const labels = data.map(item => item.area);
            const values = data.map(item => item.total);

        setChartData({
        labels,
        datasets: [{
            label: 'Total Crimes',
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            }]
        });
        });
        
        fetch('http://localhost:8000/api/visuals/vicinity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(data => {
        const labels = data.map(item => item.location);
        const values = data.map(item => item.total);

        setVicinityData({
            labels,
            datasets: [{
            label: 'Crime Count by Premise',
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            }]
        });
        });

        fetch('http://localhost:8000/api/visuals/time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
            })
        .then(res => res.json())
        .then(data => {
            const labels = data.map(d => d.time_of_day);
            const values = data.map(d => d.total);
            const colors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
            ];

            setTimeData({
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
            }]
            });
      });
    }, []);

    if (!chartData) return <p className="text-white">Loading chart...</p>;
    return(
        <section className="py-10 px-6">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-xl shadow-md px-8 py-6 max-w-3xl mx-auto text-center p-5">
            <h2 className="font-bold text-gray-800 mb-6 text-center text-white text-6xl drop-shadow-md">Analysis of LA Proper</h2>
        </div>
        <div className="max-w-5xl mx-auto mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-4xl font-bold text-center text-white mb-4">Crimes by Area</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#fff',
                        bodyColor: '#d1d5db',
                    },
                    },
                    scales: {
                    x: {
                        ticks: {
                        color: '#e5e7eb',
                        maxRotation: 45,
                        minRotation: 30,
                        font: { size: 10 },
                        },
                        grid: {
                        display: false,
                        },
                    },
                    y: {
                        ticks: {
                        color: '#e5e7eb',
                        font: { size: 12 },
                        },
                        grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                    },
                    layout: {
                    padding: 20,
                    },
                }}
            />

        </div>
        {vicinityData && (
            <div className="max-w-5xl mx-auto mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
                <h2 className="text-4xl font-bold text-center text-white mb-4">Crimes by Premise Type</h2>
                <Bar
                data={vicinityData}
                options={{
                    responsive: true,
                    plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#fff',
                        bodyColor: '#d1d5db',
                    },
                    },
                    scales: {
                    x: {
                        ticks: {
                        color: '#e5e7eb',
                        maxRotation: 45,
                        minRotation: 30,
                        font: { size: 10 },
                        },
                        grid: {
                        display: false,
                        },
                    },
                    y: {
                        ticks: {
                        color: '#e5e7eb',
                        font: { size: 12 },
                        },
                        grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                    },
                    layout: { padding: 20 },
                }}
                />
            </div>
            )}
            <div className="max-w-xl mx-auto mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-white mb-4">Crimes by Time of Day</h2>
            {timeData ? (
                <Pie data={timeData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                            labels: {
                                color: '#ffffff', // ✅ white or your preferred color
                                font: {
                                size: 14,
                                weight: 'bold',
                                },
                            },
                            },
                        },
                }} />
            ) : (
                <p className="text-white">Loading...</p>
            )}
            </div>
        </section>
    );
}

export default Overall;
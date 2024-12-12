import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Pie1 = ({ data }) => {
  // Đếm số lần mỗi mức score xuất hiện
  const scoreCounts = data.reduce((acc, item) => {
    acc[item.score] = (acc[item.score] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(scoreCounts), // Các mức score
    datasets: [
      {
        label: 'Số lần đạt',
        data: Object.values(scoreCounts), // Số lần xuất hiện của từng score
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Hiển thị chú thích ở trên
      },
      datalabels: {
        color: 'black', // Màu chữ
        formatter: (value) => {
          return `${value} `; // Hiển thị số lần và %
        },
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: context => {
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1); // Tính phần trăm
            return `${context.label}: ${context.raw} lần (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Pie
      data={chartData}
      options={options}
      plugins={[ChartDataLabels]} // Kích hoạt plugin
    />
  );
};

export default Pie1;

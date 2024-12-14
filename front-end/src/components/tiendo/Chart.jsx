import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Chart = ({ data }) => {
  const reversedData = [...data].reverse();
  const chartData = {
    labels: reversedData.map(item => new Date(item.createdAt).toLocaleDateString('vi-VN')),
    datasets: [
      {
        label: 'Điểm của bạn',
        data: reversedData.map(item => item.score),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'black', // Màu chữ
        anchor: 'end', // Vị trí: trên cột
        align: 'top', // Canh chỉnh
        formatter: (value) => value.toFixed(2), // Hiển thị giá trị
        font: {
          size: 12, // Kích thước chữ
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: context => `Điểm: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày làm bài',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Điểm',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Bar
      data={chartData}
      options={options}
      plugins={[ChartDataLabels]} // Kích hoạt plugin
    />
  );
};

export default Chart;

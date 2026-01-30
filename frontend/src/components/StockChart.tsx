'use client';

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   ArcElement
);

interface StockChartProps {
   type?: 'line' | 'doughnut';
   data: any;
   title?: string;
}

export default function StockChart({ type = 'line', data, title }: StockChartProps) {
   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: 'top' as const,
            labels: {
               color: 'white'
            }
         },
         title: {
            display: !!title,
            text: title,
            color: 'white'
         },
      },
      scales: type === 'line' ? {
         y: {
            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
         },
         x: {
            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
         }
      } : undefined
   };

   return (
      <div className="glass-card p-4 rounded-xl w-full h-full min-h-[300px] flex items-center justify-center">
         {type === 'line' ? <Line options={options} data={data} /> : <Doughnut options={options} data={data} />}
      </div>
   );
}

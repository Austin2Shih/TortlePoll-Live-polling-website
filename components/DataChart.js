import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

import { Bar } from "react-chartjs-2"

export default function PollDisplay(props) {
    const data = {
      labels: props.data.options.map((option) => {
          return option.option;
        }),
        datasets: [{
          label: 'votes',
          data: props.data.options.map((option) => {
            return option.votes;
          }),
          borderWidth: 3,
        }]
      
    }

    const options = {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }

    return (
      <div>
        <Bar data={data} height={300} options={options}/>
      </div>
    )
}
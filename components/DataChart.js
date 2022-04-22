import styles from '../styles/Chart.module.css'

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
    const sortedOptions = props.data.options.sort((a, b) => {
      return b.votes - a.votes;
    })
    const data = {
      labels: sortedOptions.map((option) => {
          return option.option;
        }),
        datasets: [{
          data: sortedOptions.map((option) => {
            return option.votes;
          }),
          categoryPercentage: 1.0,
          barPercentage: 0.9,
        }]
      
    }

    const options = {
      indexAxis: 'y',
      scales: {
        y: {
          ticks: {
            mirror: true
          },
          grid: {
            display: false
          },
        }, 
        x: {
          display: false
        },
      },

      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }

    }

    return (
      <div className={styles.chartContainer}>
        <Bar data={data} options={options}/>
      </div>
    )
}
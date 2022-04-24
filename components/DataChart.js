import styles from '../styles/Pollpage.module.css'
import { countVotes } from '../util/pollHandling'

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,

} from "chart.js"

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

import { Bar, Doughnut } from "react-chartjs-2"

function generateColors(num) {
  let output = []
  for (let i = 0; i < num; i++) {
    output.push(`hsla(${(i * 30) % 360}, 100%, 65%, 0.6)`)
  }
  return output;
}

export default function PollDisplay(props) {
    const sortedOptions = props.data.options.sort((a, b) => {
      return b.votes - a.votes;
    })
    const data = {
      labels: sortedOptions.map((option) => {
          const votes = option.votes;
          const votesText = (votes == 1)? 'vote' : 'votes';
          const percentage = Math.round((votes/countVotes(props.data.options)*100 + Number.EPSILON) * 100) / 100;
          const output = `    ${option.option}               ${percentage}% (${votes} ${votesText})`
          return output;
        }),
        datasets: [{
          data: sortedOptions.map((option) => {
            return option.votes;
          }),
          backgroundColor: generateColors(props.data.options.length),
          color: 'white',
          categoryPercentage: 1.0,
          barPercentage: 0.9,
        }]
      
    }

    const options = {
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        y: {
          ticks: {
            mirror: true,
            display: true,
            color: 'black',
            font: {
              size: 18,
              family: 'Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen',
            }
          },
          grid: {
            display: false
          },

        }, 
        x: {
          display: false
        },
      },
      responsive: true,

      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 0,
          borderRadius: 6,
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },




    }

    return (
      <div className={styles.flexContainer}>
        <div className={styles.barContainer}>
          <Bar data={data} options={options}/>
        </div>
        <div className={styles.donutContainer}>
          <Doughnut data={data} options={{plugins: {
              legend: {
                display: false
              }}}}>
          </Doughnut>
        </div>
      </div>

    )
}
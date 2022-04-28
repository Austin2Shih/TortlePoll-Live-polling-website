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

let barThickness = 50

export default function PollDisplay(props) {
    const sortedOptions = props.data.options.sort((a, b) => {
      return b.votes - a.votes;
    })
    const data = {
      labels: sortedOptions.map((option) => {
          const output = `    ${option.option}`
          return output;
        }),
        datasets: [{
          data: sortedOptions.map((option) => {
            return option.votes;
          }),
          backgroundColor: generateColors(props.data.options.length),
          color: 'white',
          barThickness: barThickness,
        }]
      
    }

    const options = {
      responsive: true,
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
            },
            lineWidth: 30,
          },
          grid: {
            display: false
          },

        }, 
        x: {
          display: false
        },
      },

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
        <div className={styles.barMain}>
          <div className={styles.barContainer} style={{height: (props.data.options.length * (barThickness + 5) + 32) + "px" }}>
            <Bar data={data} options={options}/>
          </div>
          <div className={styles.votes}>
            {
            sortedOptions.map((option, index) => {
              const votes = option.votes;
              const votesText = (votes == 1)? 'vote' : 'votes';
              const percentage = Math.round((votes/countVotes(props.data.options)*100 + Number.EPSILON) * 100) / 100;
              const output = `${percentage}% (${votes} ${votesText})`
            return <div key={index} className={styles.voteBox}>
                    <p style={{overflowWrap: 'none'}}>{output}</p>
                  </div>
          })}
          </div>
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
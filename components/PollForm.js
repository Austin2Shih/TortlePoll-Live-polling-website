import { useState } from 'react'; 


function makeOptionsList(count) {
  const optionsList = []
  for (let i = 0; i < count; i++) {
    optionsList.push(i + 1);
  }
  return optionsList.map( (count) => {
    return (<div key={count}>
      <label htmlFor={`option${count}`}>Option {count}</label>
      <input type="text" id={`option${count}`} name={`option${count}`} required />
    </div>)
  })
  
}

var listSize = 2;

export default function PollForm() {

  const [options, setOptions] = useState(makeOptionsList(listSize))

    function increaseList() {
      listSize++;
      setOptions((makeOptionsList(listSize)))
    }

    function decreaseList() {
      if (listSize > 2) {
        listSize--;
        setOptions((makeOptionsList(listSize)))
      }
    }

    return (
      <div>
          <iframe name="bgframe" id="bgframe" style={{display: "none"}}></iframe>
          <form action="/api/create_poll" method="post" target="bgframe">
            <label htmlFor="question">Poll Question</label>
            <input type="text" id="question" name="question" required />
            {options}  
            <button type="submit">Submit</button>
          </form>
          <button type="text" onClick={increaseList}> + </button>
          <button type="text" onClick={decreaseList}> - </button>
      </div>
    )
  }
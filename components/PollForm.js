export default function PollForm() {
    return (
      <form action="/api/create_poll" method="post" target="_blank">
        <label htmlFor="question">Poll Question</label>
        <input type="text" id="question" name="question" required />
  
        <label htmlFor="option1">Option 1</label>
        <input type="text" id="option1" name="option1" required />

        <label htmlFor="option2">Option 2</label>
        <input type="text" id="option2" name="option2" required />
  
        <button type="submit">Submit</button>
      </form>
    )
  }
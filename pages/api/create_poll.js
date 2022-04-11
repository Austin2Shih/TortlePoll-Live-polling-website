import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)
  const body = req.body

  const pollObject = {
      question: body.question,
  }

  var optionsCount = Object.keys(body).length - 1;
  let optionsList = []
  for (let i = 0; i < optionsCount; i++) {
    optionsList.push({
        id: i,
        option: body[`option${i + 1}`],
        votes: 0
    })
  }

  pollObject['options'] = optionsList

  console.log(pollObject)
  const pollID = await db.collection("polls").insertOne(pollObject)
    .then(async (id) => {
        console.log(`poll created at id: ${id.insertedId}`)
        return id.insertedId
    }).catch(async () => {
        console.log('poll could not be created')
        return null
    })

  
  res.json({
      pollID : pollID
  });
}
import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('polls')

  const body = req.body
  const pollObject = {
      question: body.question,
      options: [body.option1, body.option2],
  }

  const response = await db.collection("created_polls").insertOne(pollObject)
    .then(async () => {
        console.log('poll created')
    }).catch(async () => {
        console.log('poll failed')
    })

  res.json(response);
}
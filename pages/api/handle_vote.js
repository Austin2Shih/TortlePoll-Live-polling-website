import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
const Pusher = require('pusher')

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)

  let pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  })

  const data = req.body
  const pollID = data._id
  const voteIndex = data.index

  console.log("handled vote")

  const response = await db.collection("polls").updateOne(
    {
      "_id": ObjectID(pollID),
      "options.id" : voteIndex
    },
    {
      $inc: { "options.$.votes" : 1 }
    },
    {
      upsert: true
    }
  ).then(() => {
    pusher.trigger('polling-development', `new-vote-${pollID}`, {}, () => {
      res.status(200).end('vote sent successfully')
    })
  })

  res.json(response);
}

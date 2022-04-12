import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
const Pusher = require('pusher')
//import pusher from '../../util/pusher';

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
  ).then(async () => {
    console.log("triggering")
    pusher.trigger('polling-development', `new-vote-${pollID}`, {})
  }).catch((error) => {
    console.log(error)
    pusher.trigger('polling-development', `new-vote-${pollID}`, {})
  })

  res.json(response);
}

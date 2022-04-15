import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
//import pusher from '../../util/pusher';
const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
})

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)

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
    const res = await pusher.trigger('polling-development', `new-vote-${pollID}`, {}).then((r) => {
    }).catch((error) => {
      console.log(error)
    })
  })

  res.json(response);
}

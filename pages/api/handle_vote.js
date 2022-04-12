import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
import pusher from '../../util/pusher';
import ably from '../../util/ably';


export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)

  const data = req.body
  const pollID = data._id
  const voteIndex = data.index
  
  var channel = ably.channels.get(`new-vote-${pollID}`)

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
    channel.publish('greeting', {})
    //pusher.trigger('polling-development', `new-vote-${pollID}`, {})
  })

  res.json(response);
}

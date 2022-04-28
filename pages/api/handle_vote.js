import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
import pusher from '../../util/pusher.js'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db("polls")
  const dbUsers = client.db("users")

  const data = req.body
  const pollID = data._id
  const voteIndex = data.index
  let user = data.user
  const userId = user._id
  user.votedPolls.push(pollID)

  const response = await db.collection("polls").updateOne(
    {
      "_id": ObjectID(pollID),
      "options.id" : voteIndex
    },
    {
      $inc: { "options.$.votes" : 1 },
      $push: { "options.$.voters" : user}
    },
    {
      upsert: true
    }
    ).then(async () => {
      await pusher.trigger('polling-development', `new-vote-${pollID}`, {})
  })

  await dbUsers.collection("users").updateOne(
    {
      "_id": ObjectID(userId),
    },
    {
      $push: { "votedPolls" : pollID }
    },
    {
      upsert: true
    }
  ).catch((e) => {
    console.error(e)
  })

  res.json(response);
}
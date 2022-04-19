import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
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
  const dbUsers = client.db("users")

  const data = req.body
  const pollID = data._id
  const pollQuestion = data.question
  const voteIndex = data.index
  let user = data.user
  const userId = user._id
  user.votedPolls.push({
    id: pollID,
    question: pollQuestion
  })


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
    const res = await pusher.trigger('polling-development', `new-vote-${pollID}`, {}).then((r) => {
    }).catch((error) => {
      console.log(error)
    })
  })

  await dbUsers.collection("users").updateOne(
    {
      "_id": ObjectID(userId),
    },
    {
      $push: { "votedPolls" : {
        "id" : pollID,
        "question" : pollQuestion
      } }
    },
    {
      upsert: true
    }
  ).catch((e) => {
    console.error(e)
  })

  res.json(response);
}
import clientPromise from '../../util/mongodb';
import { ObjectID } from 'bson';


export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS) // database access for polls
  const dbUsers = client.db("users")  // database access for users
  const body = req.body

  // create poll
  const pollID = await db.collection("polls").insertOne(body)
    .then(async (id) => {
        console.log(`poll created at: http://localhost:3000/poll?id=${id.insertedId}`)
        return id.insertedId
    }).catch(async () => {
        console.log('poll could not be created')
        return null
    })

  // add this poll's id to the user's list of created polls
  await dbUsers.collection("users").updateOne(
      {
        "_id": ObjectID(body.userId),
      },
      {
        $push: { "polls" : pollID }
      },
      {
        upsert: true
      }
    ).catch((e) => {
      console.error(e)
    })


  // returns the id of the poll so we can generate links to the poll
  res.json({
      pollID : pollID
  });
}
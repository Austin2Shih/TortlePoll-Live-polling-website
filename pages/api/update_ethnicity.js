import clientPromise from '../../util/mongodb';
import { ObjectID } from 'bson';
export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db("users")
  const db2 = client.db("polls")
  const body = req.body
  const id = body.user.mongoData._id
  const state = body.state

  await db.collection("users").updateOne(
    {
      "_id": ObjectID(id),
    },
    {
      $set: { "info.ethnicity" : state },
    },
    {
      upsert: true
    })
    .then(async (id) => {
        return id.insertedId
    }).catch(async () => {
        console.log('failed to update user info part 1')
        return null
    })
  

  // update the ethnicity in every poll the user has voted for, just in case this changes
  const polls = body.user.mongoData.votedPolls
  polls.map(async (poll) => {
    await db2.collection("polls").updateOne(
        {
           "_id": ObjectID(poll.id),
        },
        {
          $set: { "options.$[].voters.$[user].info.ethnicity" : state },
        },
          { arrayFilters: [  { "user._id": { $eq: id } } ] },
        {
          upsert: true
        }
      )
      .then(async (id) => {
          return id.insertedId
      }).catch(async (error) => {
          console.error(error)
          console.log('failed to update user info part 2')
          return null
      })
  })


  res.json({id: id})
}
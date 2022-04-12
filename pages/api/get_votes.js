import { ObjectID } from 'bson'
import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)
  const id = req.body._id
  const data = await db.collection("polls").findOne(
      {
          "_id": ObjectID(id)
      }).catch()

  const output = JSON.parse(JSON.stringify(data))

  res.json(output);
}

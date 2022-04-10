import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
import pusher from '../../util/pusher';
//const Pusher = require('pusher')

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  const response = await db.collection("button_clicks").updateOne(
    {
      "_id": ObjectID("6251f8d9d60e3e145cba7917")
    },
    {
      $inc: { clicks: 1 }
    },
    {
      upsert: true
    }
  ).then(async () => pusher.trigger('polling-development', 'new-click', {}))

  res.json(response);
}

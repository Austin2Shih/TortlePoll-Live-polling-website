import { ObjectID } from 'bson';
import clientPromise from '../../util/mongodb';
const Pusher = require('pusher')

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  const pusher = new Pusher({
    appId: '1383149',
    key: '0306e332b12262d7342d',
    secret: 'c0776f50656865c03451',
    cluster: 'us3',
    useTLS: true,
  })

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
  );

  pusher.trigger('polling-development', 'new-click', {})

  res.json(response);
}

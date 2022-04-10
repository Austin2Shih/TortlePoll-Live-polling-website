import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  const data = await db.collection("button_clicks").find({}).toArray();
  
  const numClicks = data[0].clicks;

  res.json({count: numClicks});
}

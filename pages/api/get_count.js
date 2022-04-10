import { connectToDatabase } from '../../util/mongodb';

export default async function handler(req, res) {
  console.log("getting count")
  const {db} = await connectToDatabase();

  const data = await db.collection("button_clicks").find({}).toArray();
  
  const numClicks = data[0].clicks;

  res.json({count: numClicks});
}

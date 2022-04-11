import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_POLLS)
  const body = req.body

  const pollID = await db.collection("polls").insertOne(body)
    .then(async (id) => {
        console.log(`poll created at: http://localhost:3000/poll?id=${id.insertedId}`)
        return id.insertedId
    }).catch(async () => {
        console.log('poll could not be created')
        return null
    })


  res.json({
      pollID : pollID
  });
}
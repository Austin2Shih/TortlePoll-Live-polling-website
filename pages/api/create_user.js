import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db("users")
  const body = req.body

  const pollID = await db.collection("users").insertOne(body)
    .then(async (id) => {
        console.log(`user created`)
        return id.insertedId
    }).catch(async () => {
        console.log('user could not be created')
        return null
    })


  res.json({
      pollID : pollID
  });
}
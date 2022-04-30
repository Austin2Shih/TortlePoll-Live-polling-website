import clientPromise from '../../util/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db("users")
  const email = req.body.email

  const data = await db.collection("users").findOne(
      {
          "email": email
      }).catch()


  const output = JSON.parse(JSON.stringify(data))

  if (output) {
    res.json(output);
  } else {
    res.json({
      email: null
    })
  }
  
}

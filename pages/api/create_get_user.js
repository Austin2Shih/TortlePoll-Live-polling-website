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
    let data = {
      email: email,
      info : {
        ethnicity: null,
        gender: null,
        birthday: null,
      },
      polls: [],
      votedPolls: []
    }
    const userId = await db.collection("users").insertOne(data)
    .then(async (id) => {
        console.log(`user created`)
        return id.insertedId
    }).catch(async () => {
        console.log('user could not be created')
        return null
    })
    data['_id'] = userId
    res.json(data)
  }

}

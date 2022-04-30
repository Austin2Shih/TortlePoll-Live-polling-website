import clientPromise from '../../util/mongodb';

/*
  Function that searches mongodb database for a user with the existing email
  If there is no corresponding user, create a new user and return the user's data
*/
export default async function handler(req, res) {
  console.log("CREATE GET UESR")
  const client = await clientPromise
  const db = client.db("users")

  const email = req.body.email

  const data = await db.collection("users").findOne(   // initial search for user
      {
          "email": email
      }).catch()


  const output = JSON.parse(JSON.stringify(data))
  if (output) {
    res.json(output); // If user found, return user
  } else {
    // Create user with this data
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
    data['_id'] = userId  // inject user id into the data as this is used in many functions
    res.json(data)
  }

}

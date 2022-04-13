const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  keepAlive: true
})

module.exports = (req, res) => {
    const data = req.body
    const pollID = data._id
    pusher.trigger('polling-development', `new-vote-${pollID}`);

    res.json(data)
};
const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
})

module.exports = (req, res) => {
  const data = req.body;
  pusher.trigger('polling-development', 'solo-trigger', data, () => {
    res.status(200).end('sent event successfully');
  });

  res.json(data)
};
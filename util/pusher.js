const Pusher = require('pusher')

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
})


// Export a module-scoped pusher. By doing this in a
// separate module, the client can be shared across functions.
export default pusher
import * as Ably from "ably";
const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

// Export a module-scoped pusher. By doing this in a
// separate module, the client can be shared across functions.
export default ably


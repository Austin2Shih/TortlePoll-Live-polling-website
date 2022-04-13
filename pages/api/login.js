import {Magic} from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from '../../util/cookie'

let magic = new Magic(process.env.MAGIC_SECRET_KEY)

export default async (req, res) => {
    // exchange the DID from Magic for some user data
    const did = magic.utils.parseAuthorizationHeader(req.headers.authorization)
    const user = await magic.users.getMetadataByToken(did)

    // Provide cookies to allow user to stay logged in
    const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET, Iron.defaults)
    CookieService.setTokenCookie(res, token)

    res.end()
  }
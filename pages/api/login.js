import {Magic} from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from '../../util/cookie'

export default async (req, res) => {
    // exchange the DID from Magic for some user data
    const did = req.headers.authorization.split('Bearer').pop().trim()
    const user = await new Magic(process.env.MAGIC_SECRET_KEY).users.getMetadataByToken(did)

    // Provide cookies to allow user to stay logged in
    const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET, Iron.defaults)
    CookieService.setTokenCookie(res, token)

    res.end()
  }
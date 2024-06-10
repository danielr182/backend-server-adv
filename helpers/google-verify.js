const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
async function googleVerify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    throw new Error('verifyIdToken: Token is not valid');
  }
}

module.exports = { googleVerify };

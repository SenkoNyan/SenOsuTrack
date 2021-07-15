const axios = require('axios').default
const osu = require('node-osu')

const osuApi = new osu.Api(process.env.OSU_API_KEY, {
  completeScores: true,
  parseNumeric: false,
  notFoundAsError: false
})

class OsuApiv2 {
  name = 'Bancho'
  base = 'https://osu.ppy.sh/api/v2/'
  userUrlBase = 'https://osu.ppy.sh/users/'
  avatarUrl = 'http://s.ppy.sh/a/'
  clientId = null
  clientSecret = null
  token = null
  tokenExpire = null

  constructor (clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async getToken () {
    const { data } = await axios.post('https://osu.ppy.sh/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public'
    })

    this.token = data.access_token
    this.tokenExpire = new Date(data.expires_in * 1000)
  }

  async fetch (endpoint) {
    // Check if the token is expired
    if ((this.tokenExpire && new Date() > this.tokenExpire) || !this.tokenExpire) {
      console.log('osu! API v2 access_token is expired or need to be created')
      await this.getToken()
    }

    const { data } = await axios.get(`${this.base}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return data
  }
}

module.exports = {
  osu: osuApi,
  OsuApiv2
}

// file used in AWS Lambda function

exports.handler = (event, context, callback) => {
  var Twitter = require('twitter')
  require('dotenv/config')

  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN,
  })

  // Jae78613139

  var params = {
    screen_name: event['queryStringParameters']['username'],
    count: 200,
    include_rts: true,
  }

  client.get(
    'statuses/user_timeline',
    params,
    function (error, tweets, response) {
      if (!error) {
        let response1 = {
          statusCode: 200,
          isBase64Encoded: false,
          headers: {
            'x-custom-header': 'my custom header value',
          },
          body: JSON.stringify(tweets),
        }
        callback(null, response1)
      } else {
        console.log(error)
      }
    }
  )
}

import { reduceTweets } from './processData'

export default function parseJsonData(data, onComplete) {
  // console.log(data)
  const jsonData = data.map((tweet) => {
    // console.log(tweet)
    // const parseTweet = JSON.parse(tweet)
    // console.log(parseTweet)
    return {
      timestamp: new Date(tweet.created_at).getTime(),
      tweet_id: tweet.id,
      text: tweet.text,
      source: tweet.source,
      in_reply_to_status_id: tweet.in_reply_to_status_id,
    }
  })

  // console.log(jsonData)

  let parsedData = {
    years: {},
    days: {},
    errors: [],
  }

  const hold = reduceTweets(parsedData, jsonData)
  onComplete(hold)
}

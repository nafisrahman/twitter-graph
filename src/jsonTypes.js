/* @flow */

export type Year = {
  year: string,
  total: number,
  range: {
    start: string,
    end: string,
  },
}
export type DayContribution = {
  date: string,
  timestamp: number,
  count: number,
  color: string,
  intensity: number,
}
export type CanvasData = {
  years: Array<Year>,
  contributions: Array<DayContribution>,
}

export type TweetRawLines = {
  timestamp: string,
  tweet_id: number,
  text: string,
  source: ?string,
  in_reply_to_status_id: ?number,
}

export type ContributionsByYear = {
  years: {
    [string]: Year,
  },
  days: {
    [string]: DayContribution,
  },
  errors: Array<TweetRawLines>,
}

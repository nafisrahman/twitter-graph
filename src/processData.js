/* @flow */

import {
  type DayContribution,
  type ContributionsByYear,
  type CanvasData,
  type TweetRawLines,
  type Year,
} from './jsonTypes'

// https://github.com/sallar/github-contributions-api/blob/master/src/fetch.js
const COLOR_MAP = [
  '#196127',
  '#239a3b',
  '#7bc96f',
  '#c6e48b',
  '#ebedf0',
].reverse()

// TODO: proper normal distribution as github supposedly does
function calculateIntensity(maxInYear: number, count: number): number {
  if (count === 0) {
    return 0
  }
  const quartile = maxInYear > 4 ? maxInYear / 4 : 1
  if (count > 0 && count <= quartile) {
    return 1
  }
  if (count > quartile && count <= quartile * 2) {
    return 2
  }
  if (count > quartile && count <= quartile * 3) {
    return 3
  }
  return 4
}

export function reduceTweets(
  data: ContributionsByYear,
  tweetsToProcess: Array<TweetRawLines>
): ContributionsByYear {
  const originalTweets = tweetsToProcess.filter(
    (f) => !f.retweeted_status_id && !f.in_reply_to_status_id && f.timestamp
  )
  return originalTweets.reduce((acc, tweet) => {
    const date = new Date(tweet.timestamp)
    const year = date.getFullYear().toString()
    if (
      !tweet.timestamp ||
      date.toString() === 'Invalid Date' ||
      year.length > 4
    ) {
      return {
        ...acc,
        errors: acc.errors.concat(tweet),
      }
    }
    const day = iso(date)
    return {
      years: {
        ...acc.years,
        [year]: incrementYear(year, acc.years[year]),
      },
      days: {
        ...acc.days,
        [day]: incrementDay(date, acc.days[day] ? acc.days[day] : null),
      },
      errors: acc.errors,
    }
  }, data)
}

export function prepareToCanvasData(data: ContributionsByYear): CanvasData {
  const daysArray = Object.keys(data.days)
    .map((k) => data.days[k])
    .sort((a, b) => a.timestamp - b.timestamp)
  const minDate = new Date(daysArray[0].timestamp)
  const maxDate = new Date(daysArray[daysArray.length - 1].timestamp)
  const maxContributionsByYear = daysArray.reduce((acc, day) => {
    const year = new Date(day.timestamp).getFullYear()
    return {
      ...acc,
      [year]: day.count > (acc[year] || 0) ? day.count : acc[year],
    }
  }, {})

  return {
    years: Object.keys(data.years)
      .sort((a, b) => Number(b) - Number(a))
      .map((k) => ({
        ...data.years[k],
        range: {
          start:
            minDate.getFullYear() === k
              ? iso(minDate)
              : iso(new Date(Number(k), 0, 1)),
          end:
            maxDate.getFullYear() === k
              ? iso(maxDate)
              : iso(new Date(Number(k), 11, 31)),
        },
      })),
    contributions: daysArray.map((day) => {
      const intensity = calculateIntensity(
        maxContributionsByYear[
          new Date(day.timestamp).getFullYear().toString()
        ],
        day.count
      )

      return {
        ...day,
        intensity,
        color: COLOR_MAP[intensity],
      }
    }),
  }
}

function incrementDay(date: Date, previous: ?DayContribution) {
  var p = previous || { count: 0, date: iso(date), timestamp: date.getTime() }
  return {
    ...p,
    count: p.count + 1,
  }
}

function incrementYear(year: string, previous: ?Year): Year {
  var y = previous || { total: 0, year }
  return {
    ...y,
    total: y.total + 1,
  }
}

function iso(date: Date): string {
  return date.toISOString().split('T')[0]
}

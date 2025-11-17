import { z } from 'zod'
import fetch from 'node-fetch'
import type { ToolFn } from '../../types'

const redditToolDefinition = {
  name: 'reddit_search',
  description: 'Use this tool to get the latest posts from reddit.',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this tool?'),
  }),
}

type RedditToolParams = z.infer<typeof redditToolDefinition.parameters>

export const redditTool: ToolFn<RedditToolParams, string> = async ({
  toolArgs,
}) => {
  const url = 'https://www.reddit.com/r/cricket/.json?limit=5'
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ai-agent/0.1 by yourusername',
    },
  })
  const data = await response.json()
  const relevantInfo = data.data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))

  return JSON.stringify(relevantInfo, null, 2)
}

export { redditToolDefinition }

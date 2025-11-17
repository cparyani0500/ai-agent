import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  description: 'Use this to tell a dad joke.',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this tool?'),
  }),
}

type DadJokeToolParams = z.infer<typeof dadJokeToolDefinition.parameters>

export const dadJokeTool: ToolFn<DadJokeToolParams, string> = async ({
  toolArgs,
}) => {
  const url = 'https://icanhazdadjoke.com/'
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })
  const data = await response.json()
  return data.joke
}

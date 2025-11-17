import type OpenAI from 'openai'
import { dadJokeTool, dadJokeToolDefinition } from './tools/dadJoke'
import {
  generateImage,
  generateImageToolDefinition,
} from './tools/generateImage'
import { redditTool, redditToolDefinition } from './tools/redditTool'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case dadJokeToolDefinition.name:
      return dadJokeTool(input)
    case generateImageToolDefinition.name:
      return generateImage(input)
    case redditToolDefinition.name:
      return redditTool(input)
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}

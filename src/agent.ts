import type { AIMessage } from '../types'
import { addMessages, getMessages, saveToolResponse } from './memory'
import { runLLM } from './llm'
import { showLoader, logMessage } from './ui'
import { runTool } from './toolRunner'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessages([{ role: 'user', content: userMessage }]) // What's the weather like today?

  const loader = showLoader('🤔')

  while (true) {
    const history = await getMessages()

    const response = await runLLM({ messages: history, tools })

    await addMessages([response])

    if (response.content) {
      // If the response has direct content, we can return early
      loader.stop()
      logMessage(response)
      return getMessages()
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0]

      loader.update(`executing: ${toolCall.function.name}`)

      const toolResponse = await runTool(toolCall, userMessage)

      await saveToolResponse(toolCall.id, toolResponse)

      loader.update(`done: ${toolCall.function.name}`)
    }
  }
}

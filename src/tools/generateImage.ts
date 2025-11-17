import type { ToolFn } from '../../types'
import { openai } from '../ai'
import { z } from 'zod'

export const generateImageToolDefinition = {
  name: 'generate_image',
  description: 'Generates an image based on the provided prompt.',
  parameters: z
    .object({
      prompt: z.string().describe(
        `The prompt to use to generate the image. Be sure to use users original message to craft a relevant prompt. 
          If you are unsure, ask the user for more details.`
      ),
    })
    .describe('Generates an image and returns the url of the image.'),
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async ({ toolArgs }) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: toolArgs.prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageUrl = response.data[0].url!

  return imageUrl
}

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const tone: number = body?.tone ?? 0.5
  const liked: string[] = body?.liked ?? []
  const rejected: string[] = body?.rejected ?? []

  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' })
  }

  // Read mantra source material
  let sourceContent: string
  try {
    const sourcePath = resolve(process.cwd(), 'content/mantra-source.md')
    sourceContent = readFileSync(sourcePath, 'utf-8')
  } catch {
    throw createError({ statusCode: 500, message: 'Could not read mantra-source.md' })
  }

  // Build tone description
  let toneDesc = 'neutral, observational, wry'
  if (tone < 0.3) toneDesc = 'dystopian, anxious, dark, cutting'
  else if (tone < 0.45) toneDesc = 'slightly dystopian, wry, uneasy'
  else if (tone > 0.7) toneDesc = 'utopian, empowering, hopeful, energizing'
  else if (tone > 0.55) toneDesc = 'slightly utopian, optimistic, forward-looking'

  // Pick a random thematic angle to force variety
  const angles = [
    'the relationship between human memory and machine memory',
    'fashion, style, taste and AI aesthetics',
    'the body, physical making, hands vs. screens',
    'language, meaning, communication in the age of LLMs',
    'time, speed, acceleration, the collapsing future',
    'identity, selfhood, authenticity when everything is generated',
    'labor, work, craft, careers being transformed',
    'creativity, imagination, the unexpected, happy accidents',
    'surveillance, data, privacy, being watched and tracked',
    'desire, consumption, luxury, wanting things',
    'nature, the organic, the analog, the offline',
    'education, learning, knowledge, the death of expertise',
    'love, connection, loneliness, digital intimacy',
    'power, control, who owns the tools',
    'play, absurdity, humor, not taking it seriously',
    'the senses — touch, smell, texture — things AI cannot feel',
    'nostalgia, what we lost, what we gained',
    'rebellion, resistance, refusing to optimize',
    'silence, slowness, doing nothing in a world of content',
    'trust, truth, hallucination, what is real',
  ]
  const angle = angles[Math.floor(Math.random() * angles.length)]

  // Pick a random structural constraint
  const structures = [
    'Use a subverted cliché or remixed idiom',
    'Use a question (rhetorical or provocative)',
    'Use a command or imperative statement',
    'Use wordplay: a pun, double meaning, or portmanteau',
    'Use contrast or juxtaposition (X but Y, X meets Y)',
    'Use a definition or equation format (X = Y, X is just Y)',
    'Use repetition or parallel structure for rhythm',
    'Use a very short statement (under 5 words) — punchy and blunt',
    'Use an observation disguised as a fact',
    'Use irony — say one thing, mean another',
  ]
  const structure = structures[Math.floor(Math.random() * structures.length)]

  // Build taste feedback section
  let feedbackSection = ''
  if (liked.length > 0) {
    feedbackSection += `\n\n## User Taste — LOVED these (generate more like these):\n${liked.map(t => `- ${t}`).join('\n')}`
  }
  if (rejected.length > 0) {
    feedbackSection += `\n\n## User Taste — DELETED these (avoid this style, tone, and structure):\n${rejected.map(t => `- ${t}`).join('\n')}`
  }

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 100,
    temperature: 1,
    messages: [
      {
        role: 'user',
        content: `${sourceContent}${feedbackSection}\n\n---\n\nGenerate exactly ONE new mantra.\n\nTone: ${toneDesc} (tone value: ${tone})\nThematic angle: ${angle}\nStructural approach: ${structure}\n\nRules:\n- Maximum 12 words, ideally under 8\n- ALL CAPS\n- No quotation marks\n- Must work as a standalone poster — bold, immediate, no explanation needed\n- Be WILDLY original — don't repeat or closely echo any seed mantra above\n- Surprise me. Be unexpected. Avoid the obvious.\n- Sound like it belongs on a building or a protest sign, not a motivational mug\n${liked.length > 0 ? '- Pay close attention to what the user LOVED — match that energy and style\n' : ''}${rejected.length > 0 ? '- AVOID anything resembling what the user DELETED\n' : ''}\nRespond with ONLY the mantra text, nothing else.`,
      },
    ],
  })

  const text = message.content[0].type === 'text'
    ? message.content[0].text.trim().replace(/^["']|["']$/g, '')
    : ''

  return { text }
})

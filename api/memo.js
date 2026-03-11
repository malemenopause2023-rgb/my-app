import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../lib/supabase.js'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  const { content } = req.body

  const message = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: `以下を1文で要約して：${content}` }]
  })
  const summary = message.content[0].text

  const { error } = await supabase
    .from('memos')
    .insert({ content, summary })

  if (error) return res.status(500).json({ error })
  res.status(200).json({ summary })
}

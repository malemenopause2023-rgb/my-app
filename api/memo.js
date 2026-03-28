const Anthropic = require('@anthropic-ai/sdk')
const { createClient } = require('@supabase/supabase-js')

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

module.exports = async function handler(req, res) {
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

const Anthropic = require('@anthropic-ai/sdk')
const { createClient } = require('@supabase/supabase-js')

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

module.exports = async function handler(req, res) {
  try {
    const { content } = req.body

    const message = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: `以下を1文で要約して：${content}` }]
    })
    const summary = message.content[0].text

    await supabase.from('memos').insert({ content, summary })

    res.status(200).json({ summary })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

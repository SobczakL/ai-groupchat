import OpenAI from "openai";

export async function llmChatExchange(message: string): Promise<string | null> {
    const openai = new OpenAI({
        apiKey: process.env.API_KEY_OPENAI
    })
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: 'system',
                    content: 'you are a helpful assistant',
                },
                {
                    role: 'user',
                    content: message
                }
            ],
        })
        const response = completion.choices[0].message.content
        return response
    }
    catch (err) {
        console.error("Error in llmChatExchange:", err)
        return null
    }
}

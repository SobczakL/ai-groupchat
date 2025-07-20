import OpenAI from "openai";
import { getConversationHistoryFromDB, type ChatMessage } from "../db/db";

export async function llmChatExchange(
    roomId: number,
    userMessageContent: string,
    systemMessage: string = "You are a helpful assistant."
): Promise<string | null> {
    const openai = new OpenAI({
        apiKey: process.env.API_KEY_OPENAI
    })
    try {

        const previousMessages: ChatMessage[] = getConversationHistoryFromDB(roomId, 20)

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
            role: "system",
            content: systemMessage
        }]

        for (const msg of previousMessages) {
            messages.push({
                role: msg.role,
                content: msg.content,
            })
        }

        messages.push({
            role: 'user',
            content: userMessageContent
        })
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages
        })
        const response = completion.choices[0].message.content
        return response
    }
    catch (err) {
        console.error("Error in llmChatExchange:", err)
        return null
    }
}

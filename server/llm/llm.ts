import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
})

async function main() {
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
                    content: 'say this is a test'
                }
            ],
        })
        console.log(completion.choices[0].message)
    }
    catch (err) {
        console.error(err)
    }
}

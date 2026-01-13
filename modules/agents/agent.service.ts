
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import z from "zod";

export class AgentService {
    constructor() {}

    async toolsHandler() {
        const contextTool = tool(({response} : {response: string})=>response, {
            name: "context",
            description: "Use this tool to get context about a topic",
            schema: z.object({
                response: z.string().describe("The response to the user's question"),
            }),
        })
        return [contextTool]
    }

    async agentsHandler() {
        const tools = await this.toolsHandler()
        const contextAgent = createAgent({
            model: "gpt-3.5-turbo",
            tools,
            systemPrompt: "You are a helpful assistant that can use tools to answer the user's question",
        })
        return contextAgent
    }

    async runAgent(){
        const agent = await this.agentsHandler()
        agent.invoke({
            messages: [{role: "user", content: "From the user's input, take the context provided and give a response"}]
        })
    }
}
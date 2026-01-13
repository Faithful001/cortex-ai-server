import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

class RagService {
  private vectorStore: MemoryVectorStore | null = null
  private llm: ChatOpenAI | null = null
  private embeddings: OpenAIEmbeddings | null = null

  private initializeClients(){
    if(!this.llm){
      this.llm = new ChatOpenAI({
         model: "gpt-3.5-turbo",
        temperature: 0.7
    })
    } 
    if(!this.embeddings){
      this.embeddings = new OpenAIEmbeddings()
    }
  }

  public async addKnowledge(text: string, metadata?: Record<string, unknown>){
      this.initializeClients()
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      })

      const docs = await splitter.createDocuments([text], metadata ? [metadata] : undefined)

      if(!this.vectorStore){
        this.vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings!)
      } else {
        this.vectorStore.addDocuments(docs)
      }

      return {
        chunksAdded: docs.length
      }
  }

  public async askQuestion(question: string, topK: number = 3) {
    if(!this.vectorStore){
      throw new Error("No knowledge added yet")
    }
    
    this.initializeClients()

    const relevantDocs = await this.vectorStore.similaritySearch(question, topK)

    if(relevantDocs.length === 0){
      return {
        answer: "I don't have enough information to answer this question",
        sources: []
      }
    }

    const context = relevantDocs.map((doc, i) => `[${i + 1}] ${doc.pageContent}`).join("\n\n")
    const sources = relevantDocs.map((doc, i) => `${doc.pageContent.substring(0, 100)}...`)

    const response = await this.llm!.invoke([
      {
        role: "system", 
        content: `You are a helpful business assistant. Answer the user's question based ONLY on the following context. 
          If the context doesn't contain enough information to answer, say so honestly. Context:
          ${context}`
      },
      {
        role: "user", 
        content: question
      }
    ])

    return {
      answer: response.content,
      sources
    } 
  }

  public hasKnowledge(){
    return this.vectorStore !== null
  }

  public clearKnowledge(){
    this.vectorStore = null
  }
}

export const ragService = new RagService()


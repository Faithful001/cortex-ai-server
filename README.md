# 🧠 Cortex AI Server

AI-powered business knowledge base API with RAG (Retrieval-Augmented Generation) using LangChain and OpenAI.

## Features

- **Add Knowledge** — Ingest business documents and text into a vector store
- **Ask Questions** — Query your knowledge base with natural language
- **Vector Search** — Uses embeddings for semantic similarity search
- **LLM Integration** — Generates answers using OpenAI GPT models

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

| Method   | Endpoint     | Description            |
| -------- | ------------ | ---------------------- |
| `POST`   | `/knowledge` | Add business knowledge |
| `POST`   | `/ask`       | Ask a question         |
| `DELETE` | `/knowledge` | Clear all knowledge    |
| `GET`    | `/health`    | Health check           |

### Add Knowledge

```bash
curl -X POST http://localhost:3000/knowledge \
  -H "Content-Type: application/json" \
  -d '{"text": "Our refund policy allows returns within 30 days..."}'
```

### Ask a Question

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is your refund policy?"}'
```

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **AI**: LangChain + OpenAI
- **Vector Store**: In-memory (MemoryVectorStore)

## License

MIT

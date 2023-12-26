import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "@/lib/config";

export const runtime = "edge";

interface IBody {
  messages: ChatCompletionRequestMessage[];
  shouldUseOpenAI: boolean;
}

export async function POST(req: Request) {
  const { messages, shouldUseOpenAI }: IBody = await req.json();

  const configuration = new Configuration({
    apiKey: shouldUseOpenAI ? env.OPENAI_API_KEY : env.TOGETHER_API_KEY,
    basePath: shouldUseOpenAI ? undefined : "https://api.together.xyz/v1",
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: shouldUseOpenAI
      ? "gpt-3.5-turbo"
      : "mistralai/Mistral-7B-Instruct-v0.2",
    stream: true,
    messages: messages,
    temperature: 0.2,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

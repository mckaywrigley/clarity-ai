import { OpenAIModel, Source } from "@/types";
import endent from "endent";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

const createTextDavinciPrompt = (query: string, sources: Source[]) => {
  return endent`INSTRUCTIONS
  Provide a 2-3 sentence answer to the query based on the sources. Be original, concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
  ###
  SOURCES
  
  ${sources.map((source, idx) => `Source [${idx + 1}]:\n${source.text}`).join("\n\n")}
  ###
  QUERY
  ${query}
  ###
  ANSWER`;
};

const createTextCuriePrompt = (query: string, sources: Source[]) => {
  return endent`INSTRUCTIONS
  Provide a 2-3 sentence answer to the query based on the sources. Be original, concise, accurate, and helpful.
  ###
  SOURCES
  
  ${sources.map((source, idx) => `Source [${idx + 1}]:\n${source.text}`).join("\n\n")}
  ###
  QUERY
  ${query}
  ###
  ANSWER`;
};

const createCodeDavinciPrompt = (query: string, sources: Source[]) => {
  return endent`INSTRUCTIONS
  Provide a 2-3 sentence answer to the query based on the sources. Be original, concise, accurate, and helpful.
  ###
  SOURCES
  
  ${sources.map((source, idx) => `Source [${idx + 1}]:\n${source.text}`).join("\n\n")}
  ###
  QUERY
  ${query}
  ###
  ANSWER`;
};

export const createPrompt = (query: string, sources: Source[], model: OpenAIModel) => {
  switch (model) {
    case OpenAIModel.DAVINCI_TEXT:
      return createTextDavinciPrompt(query, sources);
    case OpenAIModel.CURIE_TEXT:
      return createTextCuriePrompt(query, sources);
    case OpenAIModel.DAVINCI_CODE:
      return createCodeDavinciPrompt(query, sources);
    default:
      return createCodeDavinciPrompt(query, sources);
  }
};

export const OpenAIStream = async (prompt: string, model: OpenAIModel, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model,
      prompt,
      max_tokens: 120,
      temperature: 0.0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
      stop: ["###"],
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].text;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};

import { OpenAIModel } from "@/types";
import { OpenAIStream } from "@/utils/answer";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt, model, apiKey } = (await req.json()) as {
      prompt: string;
      model: OpenAIModel;
      apiKey: string;
    };

    const stream = await OpenAIStream(prompt, model, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;

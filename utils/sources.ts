import { OpenAIModel } from "@/types";

export const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

export const getSourceCount = (model: OpenAIModel) => {
  switch (model) {
    case OpenAIModel.DAVINCI_TEXT:
      return 3;
    case OpenAIModel.CURIE_TEXT:
      return 4;
    case OpenAIModel.DAVINCI_CODE:
      return 5;
    default:
      return 3;
  }
};

export const shortenSourceText = (text: string, model: OpenAIModel) => {
  switch (model) {
    case OpenAIModel.DAVINCI_TEXT:
      return text.slice(0, 1500);
    case OpenAIModel.CURIE_TEXT:
      return text.slice(0, 1500);
    case OpenAIModel.DAVINCI_CODE:
      return text.slice(0, 3000);
    default:
      return text.slice(0, 1500);
  }
};

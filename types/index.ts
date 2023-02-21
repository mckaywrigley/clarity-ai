export enum OpenAIModel {
  DAVINCI_TEXT = "text-davinci-003",
  CURIE_TEXT = "text-curie-001",
  DAVINCI_CODE = "code-davinci-002"
}

export type Source = {
  url: string;
  text: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: string[];
};

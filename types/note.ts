export type Note = {
    id: number,
    title: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    tag: string
};
  
export const tags: string[] = [
  "All",
  "Work",
  "Personal",
  "Shopping",
  "Todo",
];

export type Tag = typeof tags[number];
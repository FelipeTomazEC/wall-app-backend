export type MessageDTO = {
  username: string;
  postedAt: Date;
  text: string;
};

export type RetrieveMessagesResponse = {
  messages: MessageDTO[];
};

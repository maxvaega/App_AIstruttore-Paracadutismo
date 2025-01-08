import { ID_AI } from "@/constants/Chat";
import { IMessage } from "react-native-gifted-chat";

interface MessageOptions {
  messageId: number;
  text: string;
}

type BuildMessageFromUserOptions = MessageOptions & {
  from: "user";
  userId: string;
};

type BuildMessageFromAIOptions = MessageOptions & {
  from: "ai";
};

type BuildMessageOptions =
  | BuildMessageFromUserOptions
  | BuildMessageFromAIOptions;

function buildMessage(options: BuildMessageOptions): IMessage {
  return {
    _id: options.messageId,
    text: options.text,
    createdAt: new Date(),
    user: {
      _id: options.from === "ai" ? ID_AI : options.userId,
      name: "Istruttore",
      avatar: "https://avatar.iran.liara.run/public/42",
    },
  };
}

export function buildMessageFromAI(options: MessageOptions): IMessage {
  return buildMessage({
    messageId: options.messageId,
    text: options.text,
    from: "ai",
  });
}

export function buildMessageFromUser(
  options: BuildMessageFromUserOptions
): IMessage {
  return buildMessage({
    messageId: options.messageId,
    text: options.text,
    from: "user",
    userId: options.userId!,
  });
}

export const ChatHelper = {
  appendMessage: function (messages: IMessage[], message: IMessage) {
    const copy = [...messages];
    copy.unshift(message);
    return copy;
  },

  updateLastMessageTextAI: function (messages: IMessage[], text: string) {
    return messages.map((message, index) => {
      if (index === 0) {
        return {
          ...message,
          text,
        };
      }

      return message;
    });
  },
};

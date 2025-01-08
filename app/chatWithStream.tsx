import { Keyboard, Platform, View } from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useAuth } from "@/hooks/useAuth";
import { useStream } from "@/hooks/useStream";
import {
  buildMessageFromAI,
  buildMessageFromUser,
  ChatHelper,
} from "@/src/utils";
import Markdown from "react-native-markdown-display";

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currendIdMessageAiRef = useRef<number>(Math.random());

  useEffect(() => {
    setMessages([
      buildMessageFromAI({
        messageId: Math.random(),
        text: `Ciao ${user?.nickname}. Cosa vorresti sapere?`,
      }),
    ]);
  }, []);

  const { run, loading } = useStream({
    onEndStream: () => {
      if (Platform.OS !== "web") {
        Keyboard.dismiss();
      }
    },
    onNewPartial(partial) {
      setMessages((previousMessages) => {
        return ChatHelper.updateLastMessageTextAI(previousMessages, partial);
      });
    },
    onStartStream() {
      currendIdMessageAiRef.current = Math.random();
      setMessages((previousMessages) => {
        const newMessage = buildMessageFromAI({
          text: "",
          messageId: currendIdMessageAiRef.current,
        });
        const newList = ChatHelper.appendMessage(previousMessages, newMessage);
        return newList;
      });
    },
  });

  const onSend = useCallback((messages: IMessage[] = []) => {
    const messageText = messages[0].text;
    setMessages((previousMessages) => {
      const newMessage = buildMessageFromUser({
        messageId: Math.random(),
        text: messageText,
        from: "user",
        userId: user?.sub!,
      });
      const newList = ChatHelper.appendMessage(previousMessages, newMessage);

      return newList;
    });

    run(messageText);
  }, []);

  const [text, setText] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <GiftedChat
        placeholder="a quanti salti prendo la licenza?"
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user!.sub!,
        }}
        text={text}
        isTyping={loading}
        onInputTextChanged={(text) => setText(text)}
        messagesContainerStyle={{
          backgroundColor: "white",
        }}
        locale="it"
        renderMessageText={(m) => (
          <View
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          >
            <Markdown>{m.currentMessage.text}</Markdown>
          </View>
        )}
      />
    </View>
  );
}

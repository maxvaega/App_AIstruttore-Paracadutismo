import { Text, View, Button, Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useAuth } from "@/hooks/useAuth";
import { ask } from "@/src/api";

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Ciao ${user?.nickname}. Cosa vorresti sapere?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Istruttore",
          avatar: "https://avatar.iran.liara.run/public/42",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    const messageText = messages[0].text;
    setIsTyping(true);
    setMessages((previousMessages) => {
      let list = GiftedChat.append(previousMessages, messages);
      return list;
    });

    ask(messageText).then((answer) => {
      if (!answer) {
        return;
      }
      setMessages((previousMessages) => {
        let list = GiftedChat.append(previousMessages, [
          {
            _id: Math.random(),
            text: answer,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: "Istruttore",
              avatar: "https://avatar.iran.liara.run/public/42",
            },
          },
        ]);
        return list;
      });
      setIsTyping(false);
    });
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
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user!.sub!,
        }}
        text={text}
        isTyping={isTyping}
        onInputTextChanged={(text) => setText(text)}
        messagesContainerStyle={{
          backgroundColor: "white",
        }}
        locale="it"
      />
    </View>
  );
}

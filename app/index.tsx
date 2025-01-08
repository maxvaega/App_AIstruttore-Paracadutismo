import { Text, View, Button, Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useAuth } from "@/hooks/useAuth";
import { ask } from "@/src/api";
import MButton from "@/components/ui/MButton";

export default function Index() {
  const { login, logout, user } = useAuth();
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

  const onPressLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  };

  const onPressLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };

  const [text, setText] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View>
        <Button onPress={onPressLogout} title="Log out" />
      </View>
      {/* 
      <MButton
        title="click"
        onPress={() => {
          console.log("ciao");
        }}
      /> */}

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

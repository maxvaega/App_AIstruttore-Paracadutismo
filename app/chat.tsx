import { Keyboard, Platform, View, Image, useColorScheme } from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  Actions,
  Composer,
  Send,
  Message,
  Bubble,
  Avatar,
} from "react-native-gifted-chat";
import { useAuth } from "@/hooks/useAuth";
import { useStream } from "@/hooks/useStream";
import {
  buildMessageFromAI,
  buildMessageFromUser,
  ChatHelper,
} from "@/src/utils";
import Markdown from "react-native-markdown-display";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";

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
      Keyboard.dismiss();
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

  const chatContainerBackground = useThemeColor({}, "chatContainerBackground");
  const chatComposerBackground = useThemeColor({}, "chatComposerBackground");

  const aaa = useColorScheme();
  console.log("###", aaa);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <GiftedChat
        disableComposer={loading}
        messagesContainerStyle={{ backgroundColor: chatContainerBackground }}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: chatContainerBackground,
            }}
            primaryStyle={{
              alignItems: "center",
              marginLeft: 0,
              marginRight: 8,
              marginVertical: 8,
              padding: 0,
            }}
          />
        )}
        renderMessage={(props) => <Message {...props} />}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              color: "#000000",
              backgroundColor: chatComposerBackground,
              borderWidth: 1,
              borderRadius: 40,
              borderColor: "#ffffff",
              display: "flex",
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              margin: 0,
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            renderTime={() => null}
            wrapperStyle={{
              left: {
                borderRadius: 25,
                padding: 4,
                backgroundColor: "#ffffff",
              },
              right: {
                borderRadius: 25,
                padding: 4,
                backgroundColor: "#ffffff",
              },
            }}
          />
        )}
        renderSend={(props) => (
          <Send
            {...props}
            disabled={!props.text}
            containerStyle={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 16,
            }}
          >
            <Ionicons name="send-sharp" size={32} color={"white"} />
          </Send>
        )}
        placeholder="a quanti salti prendo la licenza?"
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user!.sub!,
        }}
        text={text}
        isTyping={loading}
        onInputTextChanged={(text) => setText(text)}
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

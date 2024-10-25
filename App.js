// App.js
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Inizializza il primo messaggio
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Ciao! Come posso aiutarti oggi?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Assistant',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const message = messages[0].text;
    sendMessageToMiddleware(message);
  }, []);

  const sendMessageToMiddleware = async (message) => {
    setIsTyping(true);
    try {
      const response = await axios.post('https://YOUR_FIREBASE_FUNCTION_URL/sendMessage', {
        message,
        userId: 'unique_user_id', // Sostituisci con l'ID utente reale
      });

      // Gestione della risposta in streaming
      const reader = response.data.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let assistantMessage = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        assistantMessage += decoder.decode(value);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(),
              text: assistantMessage,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Assistant',
              },
            },
          ])
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#007AFF',
                },
                left: {
                  backgroundColor: '#f0f0f0',
                },
              }}
            />
          );
        }}
        isTyping={isTyping}
      />
      {isTyping && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -10,
  },
});

export default App;

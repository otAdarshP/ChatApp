import React, { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Alert } from 'react-native';
import { useStompClient } from '../hooks/useStompClient';

const WS_URL = 'http://10.0.2.2:8080/ws';

const MessagingPage = () => {
  const onIncoming = useCallback(msg => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const { sendMessage, connected, error } = useStompClient(WS_URL, onIncoming);

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert('Type something to send!');
      return;
    }
    const payload = { sender: 'Hosteller', content: message };
    setMessages(prev => [...prev, payload]);
    console.log('[STOMP] → Sending', payload);
    sendMessage(payload);
    setMessage('');
  };

  return (
    <LinearGradient
      colors={['#E6E6FA', '#43328B']}
      locations={[0.01, 1]}
      style={styles.gradient}
    >
      <View style={styles.statusBar}>
        <Text style={[
          styles.statusText,
          { color: error ? 'crimson' : (connected ? 'limegreen' : 'orange') }
        ]}>
          {error ? `Error: ${error}` : 
           (connected ? 'Connected 🟢' : 'Connecting... 🔄')}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = {
  gradient: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center'
  },
};

export default MessagingPage; 
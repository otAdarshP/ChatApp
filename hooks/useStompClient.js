import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function useStompClient(url, onMessage) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[STOMP] Attempting to connect to:', url);
    
    let sockJsInstance = null;
    
    const stompClient = new Client({
      webSocketFactory: () => {
        console.log('[STOMP] Creating SockJS connection...');
        sockJsInstance = new SockJS(url, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
          debug: true
        });
        
        sockJsInstance.onopen = () => {
          console.log('[STOMP] SockJS connection opened successfully');
          console.log('[STOMP] Transport used:', sockJsInstance.transport);
        };
        
        sockJsInstance.onclose = (e) => {
          console.log('[STOMP] SockJS connection closed:', e?.reason || 'No reason provided');
          console.log('[STOMP] Close code:', e?.code);
        };
        
        sockJsInstance.onerror = (e) => {
          console.error('[STOMP] SockJS error:', e);
          setError(`Connection error: ${e?.message || 'Unknown error'}`);
        };
        
        return sockJsInstance;
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: str => console.log('[STOMP DEBUG]', str)
    });

    stompClient.onConnect = () => {
      console.log('[STOMP] ✅ Connected successfully');
      setConnected(true);
      setError(null);
      console.log('[STOMP] Subscribing to /topic/messages');
      stompClient.subscribe('/topic/messages', frame => {
        try {
          const body = JSON.parse(frame.body);
          console.log('[STOMP] ← Received message:', body);
          onMessage(body);
        } catch (e) {
          console.error('[STOMP] Error parsing message:', e);
        }
      });
    };

    stompClient.onStompError = frame => {
      const errorMsg = frame.headers['message'] || 'Unknown STOMP error';
      console.error('[STOMP] Broker error:', errorMsg);
      console.error('[STOMP] Error details:', frame.body);
      setError(`STOMP error: ${errorMsg}`);
      setConnected(false);
    };

    stompClient.onWebSocketError = event => {
      console.error('[STOMP] WebSocket error:', event);
      setError(`WebSocket error: ${event?.message || 'Connection failed'}`);
      setConnected(false);
    };

    stompClient.onDisconnect = () => {
      console.log('[STOMP] 🔴 Disconnected from server');
      setConnected(false);
    };

    try {
      console.log('[STOMP] Activating STOMP client...');
      stompClient.activate();
      clientRef.current = stompClient;
    } catch (e) {
      console.error('[STOMP] Activation error:', e);
      setError(`Activation error: ${e.message}`);
    }

    return () => {
      if (sockJsInstance) {
        console.log('[STOMP] Closing SockJS connection...');
        sockJsInstance.close();
      }
      if (clientRef.current) {
        console.log('[STOMP] Cleaning up STOMP client...');
        clientRef.current.deactivate();
        setConnected(false);
      }
    };
  }, [url, onMessage]);

  const sendMessage = payload => {
    if (!connected) {
      console.warn('[STOMP] Cannot send message - not connected');
      return;
    }
    try {
      console.log('[STOMP] → Sending message:', payload);
      clientRef.current.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error('[STOMP] Error sending message:', e);
      setError(`Send error: ${e.message}`);
    }
  };

  return { sendMessage, connected, error };
} 
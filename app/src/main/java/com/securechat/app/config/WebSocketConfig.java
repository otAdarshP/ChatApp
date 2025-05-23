package com.securechat.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
//                .setAllowedOrigins(
//                        "http://10.0.2.2:8081",   // Metro on Windows
//                        "http://localhost:8081",   // Metro on Windows
//                        "http://192.168.1.5:8081", // your device IP
//                        "exp://192.168.1.5:19000"  // Expo tunnel
//                )
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
//        set message broker
        registry.enableSimpleBroker("/topic"); // "/topic/chatRoom1
        registry.setApplicationDestinationPrefixes("/app");
//        expect message with /api/sendmessage
    }
}
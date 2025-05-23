package com.securesidences.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.securesidences.model.Message;

@Controller
public class MessageController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message handleMessage(Message message) {
        // You can add any message processing logic here
        System.out.println("Received message from " + message.getSender() + ": " + message.getContent());
        return message;
    }
} 
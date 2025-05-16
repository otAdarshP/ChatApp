package com.securechat.app.controller;

import com.securechat.app.model.ChatMessage;
import lombok.Data;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {

    @MessageMapping ("/app/sendMessage")// maps webSockets messages to the destination
    @SendTo ("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message){
        return message;
    }

    @GetMapping ("chat")
    public String chat() {
        return "chat";
    }
}

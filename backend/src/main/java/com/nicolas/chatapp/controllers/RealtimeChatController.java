package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RequiredArgsConstructor
public class RealtimeChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/messages")
    @SendTo("/group/public")
    public Message receiveMessage(@Payload Message message) {
        messagingTemplate.convertAndSend("/group/" + message.getChat().getId().toString(), message);
        return message;
    }

}

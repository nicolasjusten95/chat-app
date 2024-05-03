package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class RealtimeChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/messages")
    public void receiveMessage(@Payload Message message) {
        final String destination = "/topic/" + message.getChat().getId().toString();
        messagingTemplate.convertAndSend(destination, message);
    }

}

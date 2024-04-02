package com.nicolas.chatapp.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {

    private MessageType type;
    private String content;
    private String sender;
}

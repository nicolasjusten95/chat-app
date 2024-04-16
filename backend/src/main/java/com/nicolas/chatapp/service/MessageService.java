package com.nicolas.chatapp.service;

import com.nicolas.chatapp.dto.request.SendMessageRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.MessageException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Message;
import com.nicolas.chatapp.model.User;

import java.util.List;

public interface MessageService {

    Message sentMessage(SendMessageRequestDTO req) throws UserException, ChatException;

    List<Message> getChatMessages(Integer chatId, User reqUser) throws UserException, ChatException;

    Message findMessageById(Integer messageId, User reqUser) throws UserException, MessageException;

    void deleteMessageById(Integer messageId, User reqUser) throws UserException, MessageException;

}

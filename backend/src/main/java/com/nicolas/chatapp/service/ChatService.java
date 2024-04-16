package com.nicolas.chatapp.service;

import com.nicolas.chatapp.dto.request.GroupChatRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.User;

import java.util.List;

public interface ChatService {

    Chat createChat(User reqUser, Integer userId2) throws UserException;

    Chat findChatById(Integer id) throws ChatException;

    List<Chat> findAllByUserId(Integer userId) throws UserException;

    Chat createGroup(GroupChatRequestDTO req, User reqUser) throws UserException;

    Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;

    Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException, ChatException;

    Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException;

    void deleteChat(Integer chatId, Integer userId) throws UserException, ChatException;

}

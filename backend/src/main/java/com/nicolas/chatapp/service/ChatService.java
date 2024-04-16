package com.nicolas.chatapp.service;

import com.nicolas.chatapp.dto.request.GroupChatRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.User;

import java.util.List;

public interface ChatService {

    Chat createChat(User reqUser, Long userId2) throws UserException;

    Chat findChatById(Long id) throws ChatException;

    List<Chat> findAllByUserId(Long userId) throws UserException;

    Chat createGroup(GroupChatRequestDTO req, User reqUser) throws UserException;

    Chat addUserToGroup(Long userId, Long chatId, User reqUser) throws UserException, ChatException;

    Chat renameGroup(Long chatId, String groupName, User reqUser) throws UserException, ChatException;

    Chat removeFromGroup(Long chatId, Long userId, User reqUser) throws UserException, ChatException;

    void deleteChat(Long chatId, Long userId) throws UserException, ChatException;

}

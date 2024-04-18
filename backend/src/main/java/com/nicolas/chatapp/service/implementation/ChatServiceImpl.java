package com.nicolas.chatapp.service.implementation;

import com.nicolas.chatapp.dto.request.GroupChatRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.repository.ChatRepository;
import com.nicolas.chatapp.service.ChatService;
import com.nicolas.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final UserService userService;
    private final ChatRepository chatRepository;

    @Override
    public Chat createChat(User reqUser, Long userId2) throws UserException {

        User user2 = userService.findUserById(userId2);

        Optional<Chat> isChatExists = chatRepository.findSingleChatByUsers(user2, reqUser);

        if (isChatExists.isPresent()) {
            return isChatExists.get();
        }

        Chat chat = Chat.builder()
                .createdBy(reqUser)
                .users(new HashSet<>(Set.of(reqUser, user2)))
                .isGroup(false)
                .build();

        return chatRepository.save(chat);
    }

    @Override
    public Chat findChatById(Long id) throws ChatException {

        Optional<Chat> chat = chatRepository.findById(id);

        if (chat.isPresent()) {
            return chat.get();
        }

        throw new ChatException("No chat found with id " + id);
    }

    @Override
    public List<Chat> findAllByUserId(Long userId) throws UserException {

        User user = userService.findUserById(userId);

        return chatRepository.findChatByUserId(user.getId());
    }

    @Override
    public Chat createGroup(GroupChatRequestDTO req, User reqUser) throws UserException {

        Chat groupChat = Chat.builder()
                .isGroup(true)
                .chatName(req.chatName())
                .createdBy(reqUser)
                .admins(new HashSet<>(Set.of(reqUser)))
                .build();

        for (Long userId : req.userIds()) {
            User userToAdd = userService.findUserById(userId);
            groupChat.getUsers().add(userToAdd);
        }

        return chatRepository.save(groupChat);
    }

    @Override
    public Chat addUserToGroup(Long userId, Long chatId, User reqUser) throws UserException, ChatException {

        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);

        if (chat.getAdmins().contains(reqUser)) {
            chat.getUsers().add(user);
            return chatRepository.save(chat);
        }

        throw new UserException("User doesn't have permissions to add members to group chat");
    }

    @Override
    public Chat renameGroup(Long chatId, String groupName, User reqUser) throws UserException, ChatException {

        Chat chat = findChatById(chatId);

        if (chat.getAdmins().contains(reqUser)) {
            chat.setChatName(groupName);
            return chatRepository.save(chat);
        }

        throw new UserException("User doesn't have permissions to rename group chat");
    }

    @Override
    public Chat removeFromGroup(Long chatId, Long userId, User reqUser) throws UserException, ChatException {

        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);

        boolean isAdminOrRemoveSelf = chat.getAdmins().contains(reqUser) ||
                (chat.getUsers().contains(reqUser) && user.getId().equals(reqUser.getId()));

        if (isAdminOrRemoveSelf) {
            chat.getUsers().remove(user);
            return chatRepository.save(chat);
        }

        throw new UserException("User doesn't have permissions to remove users from group chat");
    }

    @Override
    public void deleteChat(Long chatId, Long userId) throws UserException, ChatException {

        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);

        boolean isSingleChatOrAdmin = !chat.getIsGroup() || chat.getAdmins().contains(user);

        if (isSingleChatOrAdmin) {
            chatRepository.deleteById(chatId);
        }

        throw new UserException("User doesn't have permissions to delete group chat");
    }

}

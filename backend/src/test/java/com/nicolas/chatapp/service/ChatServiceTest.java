package com.nicolas.chatapp.service;

import com.nicolas.chatapp.AbstractIntegrationTest;
import com.nicolas.chatapp.dto.request.GroupChatRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.MessageException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.Message;
import com.nicolas.chatapp.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ChatServiceTest extends AbstractIntegrationTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    private final UUID leiasId = UUID.fromString("0fb97ac1-1304-4e83-b640-f659b8679907");
    private final UUID hansId = UUID.fromString("4e039f0a-5eaf-4354-ad5b-14e2889643d4");
    private final UUID lukesId = UUID.fromString("be900497-cc68-4504-9b99-4e5deaf1e6c0");
    private final UUID kenobisId = UUID.fromString("d7083ad6-9e09-453e-b7c8-65016f20ea37");
    private final UUID vadersId = UUID.fromString("f290f384-60ba-4cdd-af96-26c88ede0264");
    private final UUID palpatinesId = UUID.fromString("c419a854-010a-4a50-be82-f4587014d6e4");
    private final UUID notExistingId = UUID.fromString("4d09862c-71b6-4719-aeda-f3d961ee89b9");
    private final UUID lukesAndLeiasChatId = UUID.fromString("c40e7df3-7e67-4955-96b5-25e8769ec9bc");
    private final UUID leiaAndKenobisChatId = UUID.fromString("8a3ad4c8-3c57-43c3-aed7-f3af68da5135");
    private final UUID vaderAndLukeChatId = UUID.fromString("0bd20a41-4d23-4c4e-a8aa-8e46743f9ee4");
    private final UUID theGoodiesChatId = UUID.fromString("ac63914e-151e-444f-b44c-f67a3374f1f1");
    private final UUID theDarkSideChatId = UUID.fromString("f476eee8-9a39-4fd2-906f-9e7a746ef167");
    private final UUID messageLukeLeia1Id = UUID.fromString("620d606a-9033-4210-b9c0-982e0f3800ef");
    private final UUID messageLukeLeia2Id = UUID.fromString("15733d9e-939d-497b-b042-fd2fe54d7430");

    @Test
    void createChat() throws UserException, ChatException {

        // Create new chat
        User leia = userService.findUserById(leiasId);
        User han = userService.findUserById(hansId);
        Chat result = chatService.createChat(leia, hansId);
        Chat repositoryChat = chatService.findChatById(result.getId());
        assertThat(result.getId()).isNotNull();
        assertThat(result.getCreatedBy()).isEqualTo(leia);
        assertThat(result.getIsGroup()).isFalse();
        assertThat(result.getUsers()).containsExactlyInAnyOrderElementsOf(Set.of(leia, han));
        assertThat(repositoryChat).isEqualTo(result);

        // Create already existing chat
        Chat existingChat = chatService.createChat(leia, lukesId);
        assertThat(existingChat.getId()).isEqualTo(lukesAndLeiasChatId);

        // Create chat with non-existing user
        assertThrows(UserException.class, () -> chatService.createChat(leia, notExistingId));
    }

    @Test
    void findChatById() throws ChatException, UserException, MessageException {

        // Find existing chat
        User luke = userService.findUserById(lukesId);
        User leia = userService.findUserById(leiasId);
        Message message1 = messageService.findMessageById(messageLukeLeia1Id);
        Message message2 = messageService.findMessageById(messageLukeLeia2Id);
        Chat result = chatService.findChatById(lukesAndLeiasChatId);
        assertThat(result.getId()).isEqualTo(lukesAndLeiasChatId);
        assertThat(result.getIsGroup()).isFalse();
        assertThat(result.getCreatedBy()).isEqualTo(luke);
        assertThat(result.getUsers()).containsExactlyInAnyOrderElementsOf(Set.of(luke, leia));
        assertThat(result.getMessages()).containsExactlyElementsOf(List.of(message1, message2));

        // Find non-existing chat
        assertThrows(ChatException.class, () -> chatService.findChatById(notExistingId));
    }

    @Test
    void findAllByUserId() throws UserException, ChatException {

        // Find all by existing user
        List<Chat> result = chatService.findAllByUserId(lukesId);
        Chat chat1 = chatService.findChatById(theGoodiesChatId);
        Chat chat2 = chatService.findChatById(lukesAndLeiasChatId);
        Chat chat3 = chatService.findChatById(vaderAndLukeChatId);
        assertThat(result).containsExactlyElementsOf(List.of(chat1, chat2, chat3));

        // Find all by non-existing user
        assertThrows(UserException.class, () -> chatService.findAllByUserId(notExistingId));
    }

    @Test
    void createGroup() throws UserException, ChatException {

        // Create with existing users
        String name = "New Group Chat";
        User leia = userService.findUserById(leiasId);
        User han = userService.findUserById(hansId);
        GroupChatRequestDTO request = new GroupChatRequestDTO(List.of(leiasId, hansId), name);
        Chat chat = chatService.createGroup(request, leia);
        Chat repositoryChat = chatService.findChatById(chat.getId());
        assertThat(repositoryChat).isEqualTo(chat);
        assertThat(chat.getIsGroup()).isTrue();
        assertThat(chat.getId()).isNotNull();
        assertThat(chat.getCreatedBy()).isEqualTo(leia);
        assertThat(chat.getUsers()).containsExactlyInAnyOrderElementsOf(Set.of(leia, han));
        assertThat(chat.getChatName()).isEqualTo(name);
        assertThat(chat.getAdmins()).containsExactly(leia);

        // Create with non-existing user
        GroupChatRequestDTO request2 = new GroupChatRequestDTO(List.of(leiasId, notExistingId), "Non existing user chat");
        assertThrows(UserException.class, () -> chatService.createGroup(request2, leia));
    }

    @Test
    void addUserToGroup() throws UserException, ChatException {

        // Add user to group
        User luke = userService.findUserById(lukesId);
        User vader = userService.findUserById(vadersId);
        Chat result = chatService.addUserToGroup(vadersId, theGoodiesChatId, luke);
        assertThat(result.getUsers()).contains(vader);

        // Add as user that is not admin
        User leia = userService.findUserById(leiasId);
        assertThrows(UserException.class, () -> chatService.addUserToGroup(vadersId, theGoodiesChatId, leia));

        // Add to non-existing group
        assertThrows(ChatException.class, () -> chatService.addUserToGroup(kenobisId, notExistingId, luke));

        // Add non-existing user
        assertThrows(UserException.class, () -> chatService.addUserToGroup(notExistingId, theGoodiesChatId, luke));
    }

    @Test
    void renameGroup() throws UserException, ChatException {

        // Rename chat
        String name = "The Goodies renamed";
        User luke = userService.findUserById(lukesId);
        Chat chat = chatService.renameGroup(theGoodiesChatId, name, luke);
        assertThat(chat.getChatName()).isEqualTo(name);

        // Rename non-existing chat
        assertThrows(ChatException.class, () -> chatService.renameGroup(notExistingId, "Should not work", luke));

        // Rename as not admin
        User leia = userService.findUserById(leiasId);
        assertThrows(UserException.class, () -> chatService.renameGroup(theGoodiesChatId, "Should not work", leia));
    }

    @Test
    void removeFromGroup() throws UserException, ChatException {

        // Remove from Chat
        User luke = userService.findUserById(lukesId);
        User leia = userService.findUserById(leiasId);
        Chat result = chatService.removeFromGroup(theGoodiesChatId, leiasId, luke);
        assertThat(result.getUsers()).isNotEmpty();
        assertThat(result.getUsers()).doesNotContain(leia);

        // Remove self from chat as not admin
        User kenobi = userService.findUserById(kenobisId);
        Chat result2 = chatService.removeFromGroup(theGoodiesChatId, kenobisId, kenobi);
        assertThat(result2.getUsers()).isNotEmpty();
        assertThat(result2.getUsers()).doesNotContain(kenobi);

        // Remove from non-existing chat
        assertThrows(ChatException.class, () -> chatService.removeFromGroup(notExistingId, hansId, luke));

        // Remove non-existing user
        assertThrows(UserException.class, () -> chatService.removeFromGroup(theGoodiesChatId, notExistingId, luke));

        // Remove as not admin
        User han = userService.findUserById(hansId);
        assertThrows(UserException.class, () -> chatService.removeFromGroup(theGoodiesChatId, lukesId, han));
    }

    @Test
    void markAsRead() throws UserException, ChatException {

        // Mark chat as read
        User luke = userService.findUserById(lukesId);
        Chat result = chatService.markAsRead(theGoodiesChatId, luke);
        result.getMessages().forEach(msg -> assertThat(msg.getReadBy()).contains(luke.getId()));

        // Mark non-existing chat as read
        assertThrows(ChatException.class, () -> chatService.markAsRead(notExistingId, luke));

        // Mark chat as read that user is not a part of
        User vader = userService.findUserById(vadersId);
        assertThrows(UserException.class, () -> chatService.markAsRead(theGoodiesChatId, vader));
    }

    @Test
    void deleteChat() throws UserException, ChatException {

        // Remove non-existing chat
        assertThrows(ChatException.class, () -> chatService.deleteChat(notExistingId, palpatinesId));

        // Remove chat with non-existing user
        assertThrows(UserException.class, () -> chatService.deleteChat(theGoodiesChatId, notExistingId));

        // Remove group chat as not admin
        assertThrows(UserException.class, () -> chatService.deleteChat(theGoodiesChatId, leiasId));

        // Remove single chat
        chatService.deleteChat(leiaAndKenobisChatId, kenobisId);
        assertThrows(ChatException.class, () -> chatService.findChatById(leiaAndKenobisChatId));

        // Remove group chat as admin
        chatService.deleteChat(theDarkSideChatId, palpatinesId);
        assertThrows(ChatException.class, () -> chatService.findChatById(theDarkSideChatId));
    }

}
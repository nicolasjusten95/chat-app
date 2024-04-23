package com.nicolas.chatapp.service;

import com.nicolas.chatapp.AbstractIntegrationTest;
import com.nicolas.chatapp.dto.request.SendMessageRequestDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.MessageException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.Message;
import com.nicolas.chatapp.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class MessageServiceTest extends AbstractIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    private final UUID lukesId = UUID.fromString("be900497-cc68-4504-9b99-4e5deaf1e6c0");
    private final UUID vadersId = UUID.fromString("f290f384-60ba-4cdd-af96-26c88ede0264");
    private final UUID vaderAndLukesChatId = UUID.fromString("0bd20a41-4d23-4c4e-a8aa-8e46743f9ee4");
    private final UUID lukeAndLeiaChatId = UUID.fromString("c40e7df3-7e67-4955-96b5-25e8769ec9bc");
    private final UUID notExistingId = UUID.fromString("4d09862c-71b6-4719-aeda-f3d961ee89b9");
    private final UUID lukeAndLeiaMessage1Id = UUID.fromString("620d606a-9033-4210-b9c0-982e0f3800ef");
    private final UUID lukeAndLeiaMessage2Id = UUID.fromString("15733d9e-939d-497b-b042-fd2fe54d7430");
    private final UUID lukeTheGoodiesMessageId = UUID.fromString("6bd25bf8-dba1-46b1-8821-ba838d4a84ae");

    @Test
    void sendMessage() throws ChatException, UserException, MessageException {

        String content = "Yea sorry to tell you!";
        SendMessageRequestDTO request = new SendMessageRequestDTO(vaderAndLukesChatId, content);
        User vader = userService.findUserById(vadersId);
        Chat chat = chatService.findChatById(vaderAndLukesChatId);
        Message message = messageService.sendMessage(request, vadersId);
        Message repositoryMessage = messageService.findMessageById(message.getId());
        assertThat(message.getUser()).isEqualTo(vader);
        assertThat(message.getId()).isNotNull();
        assertThat(message.getChat()).isEqualTo(chat);
        assertThat(message.getContent()).isEqualTo(content);
        assertThat(message.getTimeStamp()).isNotNull();
        assertThat(repositoryMessage).isEqualTo(message);

        // Message from non-existing user
        assertThrows(UserException.class, () -> messageService.sendMessage(request, notExistingId));

        // Message to non-existing chat
        SendMessageRequestDTO request2 = new SendMessageRequestDTO(notExistingId, "Should not work");
        assertThrows(ChatException.class, () -> messageService.sendMessage(request2, lukesId));
    }

    @Test
    void getChatMessages() throws ChatException, UserException, MessageException {

        // Get messages for chat
        User luke = userService.findUserById(lukesId);
        User vader = userService.findUserById(vadersId);
        Message message1 = messageService.findMessageById(lukeAndLeiaMessage1Id);
        Message message2 = messageService.findMessageById(lukeAndLeiaMessage2Id);
        List<Message> result = messageService.getChatMessages(lukeAndLeiaChatId, luke);
        assertThat(result).containsExactlyElementsOf(List.of(message1, message2));

        // Get messages for non-existing chat
        assertThrows(ChatException.class, () -> messageService.getChatMessages(notExistingId, luke));

        // Get messages for user not related to chat
        assertThrows(UserException.class, () -> messageService.getChatMessages(lukeAndLeiaChatId, vader));
    }

    @Test
    void findMessageById() throws MessageException {

        // Find message
        Message result = messageService.findMessageById(lukeAndLeiaMessage1Id);
        assertThat(result).isNotNull();

        // Find non-existing message
        assertThrows(MessageException.class, () -> messageService.findMessageById(notExistingId));
    }

    @Test
    void deleteMessageById() throws UserException, MessageException {

        // Delete message
        User luke = userService.findUserById(lukesId);
        messageService.deleteMessageById(lukeTheGoodiesMessageId, luke);
        assertThrows(MessageException.class, () -> messageService.findMessageById(lukeTheGoodiesMessageId));

        // Delete non-existing message
        assertThrows(MessageException.class, () -> messageService.deleteMessageById(notExistingId, luke));

        // Delete message not from user
        assertThrows(UserException.class, () -> messageService.deleteMessageById(lukeAndLeiaMessage1Id, luke));
    }

}
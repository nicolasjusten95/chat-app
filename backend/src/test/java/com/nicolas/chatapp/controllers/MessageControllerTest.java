package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.AbstractIntegrationTest;
import com.nicolas.chatapp.config.JwtConstants;
import com.nicolas.chatapp.dto.request.LoginRequestDTO;
import com.nicolas.chatapp.dto.request.SendMessageRequestDTO;
import com.nicolas.chatapp.dto.response.LoginResponseDTO;
import com.nicolas.chatapp.dto.response.MessageDTO;
import com.nicolas.chatapp.dto.response.UserDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.MessageException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.Message;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.service.ChatService;
import com.nicolas.chatapp.service.MessageService;
import com.nicolas.chatapp.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class MessageControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MessageController messageController;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthController authController;

    private final UUID vadersId = UUID.fromString("f290f384-60ba-4cdd-af96-26c88ede0264");
    private final UUID vaderAndLukesChatId = UUID.fromString("0bd20a41-4d23-4c4e-a8aa-8e46743f9ee4");
    private final UUID lukeAndLeiaChatId = UUID.fromString("c40e7df3-7e67-4955-96b5-25e8769ec9bc");
    private final UUID notExistingId = UUID.fromString("4d09862c-71b6-4719-aeda-f3d961ee89b9");
    private final UUID lukeAndLeiaMessage1Id = UUID.fromString("620d606a-9033-4210-b9c0-982e0f3800ef");
    private final UUID lukeAndLeiaMessage2Id = UUID.fromString("15733d9e-939d-497b-b042-fd2fe54d7430");
    private final UUID lukeTheGoodiesMessageId = UUID.fromString("6bd25bf8-dba1-46b1-8821-ba838d4a84ae");

    @Test
    void sendMessage() throws UserException, ChatException, MessageException {

        String mail = "darth.vader@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "2345");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        String content = "Yea sorry to tell you!";
        SendMessageRequestDTO dto = new SendMessageRequestDTO(vaderAndLukesChatId, content);
        User vader = userService.findUserById(vadersId);
        Chat chat = chatService.findChatById(vaderAndLukesChatId);
        ResponseEntity<MessageDTO> message = messageController.sendMessage(dto, authorization);
        Message repositoryMessage = messageService.findMessageById(Objects.requireNonNull(message.getBody()).id());
        assertThat(message.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(message.getBody().user()).isEqualTo(UserDTO.fromUser(vader));
        assertThat(message.getBody().id()).isNotNull();
        assertThat(message.getBody().content()).isEqualTo(content);
        assertThat(message.getBody().timeStamp()).isNotNull();
        assertThat(MessageDTO.fromMessage(repositoryMessage)).isEqualTo(message.getBody());
        assertThat(MessageDTO.fromMessages(chat.getMessages())).contains(message.getBody());

        // Message to non-existing chat
        SendMessageRequestDTO request2 = new SendMessageRequestDTO(notExistingId, "Should not work");
        assertThrows(ChatException.class, () -> messageController.sendMessage(request2, authorization));
    }

    @Test
    void getChatMessages() throws UserException, MessageException, ChatException {

        // Get messages for chat
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        Message message1 = messageService.findMessageById(lukeAndLeiaMessage1Id);
        Message message2 = messageService.findMessageById(lukeAndLeiaMessage2Id);
        ResponseEntity<List<MessageDTO>> result = messageController.getChatMessages(lukeAndLeiaChatId, authorization);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).containsExactlyElementsOf(List.of(Objects.requireNonNull(MessageDTO.fromMessage(message1)), Objects.requireNonNull(MessageDTO.fromMessage(message2))));

        // Get messages for non-existing chat
        String finalAuthorization = authorization;
        assertThrows(ChatException.class, () -> messageController.getChatMessages(notExistingId, finalAuthorization));

        // Get messages for user not related to chat
        mail = "darth.vader@test.com";
        request = new LoginRequestDTO(mail, "2345");
        response = authController.login(request).getBody();
        assert response != null;
        authorization = JwtConstants.TOKEN_PREFIX + response.token();
        String finalAuthorization1 = authorization;
        assertThrows(UserException.class, () -> messageController.getChatMessages(lukeAndLeiaChatId, finalAuthorization1));
    }

    @Test
    void deleteMessage() throws UserException, MessageException {

        // Delete message
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        messageController.deleteMessage(lukeTheGoodiesMessageId, authorization);
        assertThrows(MessageException.class, () -> messageService.findMessageById(lukeTheGoodiesMessageId));

        // Delete non-existing message
        assertThrows(MessageException.class, () -> messageController.deleteMessage(notExistingId, authorization));

        // Delete message not from user
        assertThrows(UserException.class, () -> messageController.deleteMessage(lukeAndLeiaMessage1Id, authorization));
    }

}
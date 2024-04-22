package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.config.JwtConstants;
import com.nicolas.chatapp.dto.request.GroupChatRequestDTO;
import com.nicolas.chatapp.dto.request.SingleChatRequestDTO;
import com.nicolas.chatapp.dto.response.ApiResponseDTO;
import com.nicolas.chatapp.exception.ChatException;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.Chat;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.service.ChatService;
import com.nicolas.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {

    private final UserService userService;
    private final ChatService chatService;

    @PostMapping("/single")
    public ResponseEntity<Chat> createSingleChat(@RequestBody SingleChatRequestDTO req,
                                                 @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.createChat(user, req.userId());
        log.info("User {} created single chat: {}", user.getEmail(), chat.getId());

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupChat(@RequestBody GroupChatRequestDTO req,
                                                @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.createGroup(req, user);
        log.info("User {} created group chat: {}", user.getEmail(), chat.getId());

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> findChatById(@PathVariable("id") UUID id)
            throws ChatException {

        Chat chat = chatService.findChatById(id);

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findAllChatsByUserId(@RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException {

        User user = userService.findUserByProfile(jwt);
        List<Chat> chats = chatService.findAllByUserId(user.getId());

        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroup(@PathVariable UUID chatId, @PathVariable UUID userId,
                                               @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ChatException {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.addUserToGroup(chatId, userId, user);
        log.info("User {} added user {} to group chat: {}", user.getEmail(), userId, chat.getId());

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroup(@PathVariable UUID chatId, @PathVariable UUID userId,
                                                    @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ChatException {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.removeFromGroup(chatId, userId, user);
        log.info("User {} removed user {} from group chat: {}", user.getEmail(), userId, chat.getId());

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponseDTO> deleteChat(@PathVariable UUID id,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ChatException {

        User user = userService.findUserByProfile(jwt);
        chatService.deleteChat(id, user.getId());
        log.info("User {} deleted chat: {}", user.getEmail(), id);

        ApiResponseDTO res = ApiResponseDTO.builder()
                .message("Chat deleted successfully")
                .status(true)
                .build();

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}

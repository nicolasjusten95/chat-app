package com.nicolas.chatapp.service;

import com.nicolas.chatapp.dto.request.UpdateUserRequestDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;

import java.util.List;

public interface UserService {

    User findUserById(Long id) throws UserException;

    User findUserByProfile(String jwt) throws UserException;

    User updateUser(Long id, UpdateUserRequestDTO request) throws UserException;

    List<User> searchUser(String query);

    List<User> searchUserByName(String name);

}

package com.nicolas.chatapp.service;

import com.nicolas.chatapp.dto.request.UpdateUserRequestDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;

import java.util.List;

public interface UserService {

    public User findUserById(Long id) throws UserException;
    public User findUserByProfile(String jwt) throws UserException;
    public User updateUser(Long id, UpdateUserRequestDTO request) throws UserException;
    public List<User> searchUser(String query);
    public List<User> searchUserByName(String name);

}

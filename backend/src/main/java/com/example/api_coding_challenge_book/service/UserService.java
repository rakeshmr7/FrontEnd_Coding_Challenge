package com.example.api_coding_challenge_book.service;

import com.example.api_coding_challenge_book.dto.UserDto;
import com.example.api_coding_challenge_book.mapper.BookMapper;
import com.example.api_coding_challenge_book.mapper.UserMapper;
import com.example.api_coding_challenge_book.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public UserDto register(UserDto userDto){
        return UserMapper.toDto(
                userRepository.save(
                        UserMapper.toEntity(userDto)
                )
        );
    }

    public UserDto findByEmail(String email) {
        return UserMapper.toDto(
                userRepository.findByEmail(email)
        );
    }
}

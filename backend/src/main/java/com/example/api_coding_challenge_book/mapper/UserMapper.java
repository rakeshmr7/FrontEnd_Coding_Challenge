package com.example.api_coding_challenge_book.mapper;

import com.example.api_coding_challenge_book.dto.UserDto;
import com.example.api_coding_challenge_book.entity.User;

public class UserMapper {
    public static UserDto toDto(User user){
        if(user == null) return null;

        return new UserDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );
    }

    public static User toEntity(UserDto userDto){
        if(userDto == null) return null;

        return new User(
                userDto.getName(),
                userDto.getEmail(),
                userDto.getPassword()
        );
    }
}

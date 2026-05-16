package com.example.api_coding_challenge_book.controller;

import com.example.api_coding_challenge_book.apiResponse.ApiResponse;
import com.example.api_coding_challenge_book.dto.LoginDto;
import com.example.api_coding_challenge_book.dto.UserDto;
import com.example.api_coding_challenge_book.dto.UserResponseDto;
import com.example.api_coding_challenge_book.exception.ResourceNotFoundException;
import com.example.api_coding_challenge_book.service.UserService;
import com.example.api_coding_challenge_book.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/signUp")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody UserDto userDto){
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        if(userService.findByEmail(email) != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    new ApiResponse<>("Email already exists", HttpStatus.CONFLICT, null)
            );
        }
        userDto.setPassword(passwordEncoder.encode(password));
        UserDto userDto1 = userService.register(userDto);
        userDto1.setPassword("****");
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("User registered", HttpStatus.CREATED, userDto1)
        );
    }

    @PostMapping("/signIn")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginDto login) {

        String email = login.getEmail();
        String password = login.getPassword();
        UserDto user = userService.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>("User not registered", HttpStatus.UNAUTHORIZED, null)
            );
        if (!passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>("Invalid member", HttpStatus.UNAUTHORIZED, null)
            );
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ApiResponse<>("Login success", HttpStatus.OK, 
                    new UserResponseDto(token, user.getName())
                )
        );
    }
}

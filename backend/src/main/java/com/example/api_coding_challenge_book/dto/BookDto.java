package com.example.api_coding_challenge_book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookDto {
    private String ISBN;
    private String title;
    private String author;
    private int publicationYear;
}

package com.example.api_coding_challenge_book.mapper;

import com.example.api_coding_challenge_book.dto.BookDto;
import com.example.api_coding_challenge_book.entity.Book;

public class BookMapper {
    public static BookDto toDto(Book book){
        if(book == null) return null;

        return new BookDto(
                book.getISBN(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublicationYear()
        );
    }

    public static Book toEntity(BookDto bookDto){
        if(bookDto == null) return null;

        return new Book(
          bookDto.getISBN(),
          bookDto.getTitle(),
          bookDto.getAuthor(),
          bookDto.getPublicationYear()
        );
    }
}

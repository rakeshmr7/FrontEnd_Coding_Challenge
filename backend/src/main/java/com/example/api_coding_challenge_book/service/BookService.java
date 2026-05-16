package com.example.api_coding_challenge_book.service;

import com.example.api_coding_challenge_book.dto.BookDto;
import com.example.api_coding_challenge_book.entity.Book;
import com.example.api_coding_challenge_book.mapper.BookMapper;
import com.example.api_coding_challenge_book.repository.BookRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;

    public BookDto addBook(BookDto bookDto) {
        Book book = bookRepository.findById(bookDto.getISBN()).orElse(null);
        if(book != null) throw new DataIntegrityViolationException("Book with this ISBN already exists");
        return BookMapper.toDto(
                bookRepository.save(
                        BookMapper.toEntity(bookDto)
                )
        );
    }

    public List<BookDto> showAll() {
        List<Book> bookList = bookRepository.findAll();
        return bookList.stream().map(BookMapper::toDto).toList();
    }

    public BookDto searchByISBN(String ISBN) {
        return BookMapper.toDto(
                bookRepository.findById(ISBN).orElse(null)
        );
    }

    public BookDto update(BookDto bookDto) {
        return BookMapper.toDto(
                bookRepository.save(
                        BookMapper.toEntity(bookDto)
                )
        );
    }

    public void delete(String ISBN) {
        bookRepository.deleteById(ISBN);
    }
}

package com.example.api_coding_challenge_book.controller;

import com.example.api_coding_challenge_book.apiResponse.ApiResponse;
import com.example.api_coding_challenge_book.dto.BookDto;
import com.example.api_coding_challenge_book.entity.Book;
import com.example.api_coding_challenge_book.exception.ResourceNotFoundException;
import com.example.api_coding_challenge_book.service.BookService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
@Validated
public class BookController {
    @Autowired
    BookService bookService;

    @PostMapping("/addBook")
    public ResponseEntity<ApiResponse<?>> addBook(@Valid @RequestBody BookDto bookDto){
        if(bookDto == null) throw new ResourceNotFoundException("No book data found");
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("Book added", HttpStatus.CREATED, bookService.addBook(bookDto))
        );
    }

    @GetMapping("/showAll")
    public ResponseEntity<ApiResponse<?>> showAll(){
        List<BookDto> bookList = bookService.showAll();
        if(bookList.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>("No books added", HttpStatus.NOT_FOUND, bookList)
            );
        return ResponseEntity.status(HttpStatus.FOUND).body(
                new ApiResponse<>("Books fetched", HttpStatus.FOUND, bookList)
        );
    }

    @GetMapping("/searchByISBN/{ISBN}")
    public ResponseEntity<ApiResponse<?>> searchByISBN(@NotBlank @PathVariable String ISBN){
        BookDto bookDto = bookService.searchByISBN(ISBN);
        if(bookDto == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>("No book found", HttpStatus.NOT_FOUND, bookDto)
            );
        return ResponseEntity.status(HttpStatus.FOUND).body(
                new ApiResponse<>("Book fetched", HttpStatus.FOUND, bookDto)
        );
    }

    @PutMapping("/update/{ISBN}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable String ISBN, @Valid @RequestBody BookDto bookDto){
        BookDto b = bookService.searchByISBN(ISBN);
        if(b == null) throw new ResourceNotFoundException("No book data found");
        b.setAuthor(bookDto.getAuthor());
        b.setTitle(bookDto.getTitle());
        b.setPublicationYear(bookDto.getPublicationYear());
        return ResponseEntity.status(HttpStatus.OK).body(
                new ApiResponse<>("Book updated", HttpStatus.OK, bookService.update(b))
        );
    }

    @DeleteMapping("/delete/{ISBN}")
    public ResponseEntity<ApiResponse<?>> delete(@NotBlank @PathVariable String ISBN){
        BookDto bookDto = bookService.searchByISBN(ISBN);
        if(bookDto == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>("No book found", HttpStatus.NOT_FOUND, bookDto)
            );
        bookService.delete(ISBN);
        return ResponseEntity.status(HttpStatus.GONE).body(
                new ApiResponse<>("Book deleted", HttpStatus.GONE, bookDto)
        );
    }

}

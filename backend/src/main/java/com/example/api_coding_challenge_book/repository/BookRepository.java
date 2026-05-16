package com.example.api_coding_challenge_book.repository;

import com.example.api_coding_challenge_book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
}

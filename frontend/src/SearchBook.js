import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "./Book";

const SearchBook = () => {
  const [ISBN, setISBN] = useState("");
  const [book, setBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("currentUser")),
  );

  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  if (!currentUser) {
    nav("/signIn");
  }

  const searchBook = () => {
    if (!ISBN) {
      Modal.error({
        title: "Missing ISBN",
        content: "Please enter ISBN",
        okText: "OK",
        okButtonProps: {
          style: {
            backgroundColor: "#fc1c3d",
            borderColor: "#fc1c3d",
          },
        },
      });

      return;
    }

    setLoading(true);

    fetch(`http://localhost:9000/book/searchByISBN/${ISBN}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        if (res.status === "302 FOUND") {
            console.log(res.data);
          setBook(res.data);
          Modal.success({
            title: "Success",
            content: res.message,
            okText: "OK",
            okButtonProps: {
              style: {
                backgroundColor: "#19d250",
                borderColor: "#19d250",
              },
            },
          });
        } else {
          setBook(null);

          Modal.error({
            title: "Failed",
            content: res.message,
            okText: "OK",
            okButtonProps: {
              style: {
                backgroundColor: "#fc1c3d",
                borderColor: "#fc1c3d",
              },
            },
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <h2>Search Book</h2>

      <button onClick={() => nav("/home")}>Back</button>

      <div className="container">
        <input
          type="text"
          placeholder="Enter ISBN"
          value={ISBN}
          onChange={(e) => setISBN(e.target.value)}
        />

        <button onClick={searchBook}>Search</button>
      </div>

      {loading && (
        <Flex align="center" justify="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      )}

      {book && (
        <div className="book-container">
          <Book
            key={book.ISBN}
            ISBN={book.ISBN}
            title={book.title}
            author={book.author}
            publicationYear={book.publicationYear}
          />
        </div>
      )}
    </>
  );
};

export default SearchBook;

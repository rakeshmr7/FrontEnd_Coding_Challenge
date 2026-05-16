import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "./Book";

const AddBook = () => {
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [newBook, setNewBook] = useState({
    ISBN: "",
    title: "",
    author: "",
    publicationYear: "",
  });
  const handleInput = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) {
      nav("/signIn");
      return;
    }
    setCurrentUser(user);
    setLoading(true);
    fetch("http://localhost:9000/book/showAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        console.log(res);
        setBooks(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  const addBook = () => {
    if (
      !newBook.ISBN ||
      !newBook.title ||
      !newBook.author ||
      !newBook.publicationYear
    ) {
      Modal.error({
        title: "Missing Fields",
        content: "All fields are mandatory",
        okText: "OK",
        okButtonProps: {
          style: {
            backgroundColor: "#fc1c3d",
            borderColor: "#fc1c3d",
          },
        },
      });
    } else {
      setLoading(true);
      fetch("http://localhost:9000/book/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(newBook),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res.status === "400 BAD_REQUEST") {
            Modal.error({
              title: "400 BAD_REQUEST",
              content: "ISBN already exists",
              okText: "OK",
              okButtonProps: {
                style: {
                  backgroundColor: "#fc1c3d",
                  borderColor: "#fc1c3d",
                },
              },
            });
          } else if (res.status === "201 CREATED") {
            setBooks([...books, newBook]);
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
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="container">
        <h2>Add New Book</h2>
        <button onClick={() => nav("/home")}>Back</button>
        <input
          type="text"
          placeholder="Enter ISBN"
          name="ISBN"
          onChange={handleInput}
        />
        <br />
        <input
          type="text"
          placeholder="Enter Title"
          name="title"
          onChange={handleInput}
        />
        <br />
        <input
          type="text"
          placeholder="Enter Author"
          name="author"
          onChange={handleInput}
        />
        <br />
        <input
          type="number"
          placeholder="Enter Publication Year"
          name="publicationYear"
          onChange={handleInput}
        />
        <br />

        <button onClick={addBook}>Add Book</button>
        <br />
      </div>
      <div className="book-container">
        {books.length > 0
          ? books.map((b) => (
              <Book
                key={b.ISBN}
                ISBN={b.ISBN}
                title={b.title}
                author={b.author}
                publicationYear={b.publicationYear}
              />
            ))
          : loading && (
              <Flex align="center" justify="center">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                />
              </Flex>
            )}
      </div>
    </>
  );
};

export default AddBook;

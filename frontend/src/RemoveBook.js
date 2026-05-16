import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Book from "./Book";

const RemoveBook = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) {
      nav("/signIn");
      return;
    }
    setCurrentUser(user);
    fetch("http://localhost:9000/book/showAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const remove = (ISBN) => {
    setLoading(true);
    fetch(`http://localhost:9000/book/delete/${ISBN}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.status === "410 GONE") {
          setBooks(books.filter((b) => b.ISBN !== ISBN));
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
        } else if (res.status === "404 NOT_FOUND") {
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
      <h2>Remove Book</h2>
      <button onClick={() => nav("/home")}>Back</button>
      <div className="book-container">
        {books.length > 0
          ? books.map((b) => (
              <Book
                key={b.ISBN}
                ISBN={b.ISBN}
                title={b.title}
                author={b.author}
                publicationYear={b.publicationYear}
                removeFun={remove}
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

export default RemoveBook;

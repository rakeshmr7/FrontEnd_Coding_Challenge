import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Book from "./Book";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

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
  return (
    <>
      <h2>Welcome {currentUser?.name}</h2>
      <div className="top-buttons">
        <button onClick={() => nav("/addBook")}>Add Book</button>
        <button onClick={() => nav("/searchBook")}>Search Book</button>
        <button onClick={() => nav("/removeBook")}>Remove Book</button>
        <button onClick={() => nav("/updateBook")}>Update Book</button>
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

export default Home;

import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateBook = () => {
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

  const handleUpdate = (e, index) => {
    const updatedBooks = [...books];
    updatedBooks[index][e.target.name] = e.target.value;
    setBooks(updatedBooks);
  };

  const update = (book) => {
    setLoading(true);

    fetch(`http://localhost:9000/book/update/${book.ISBN}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        if (res.status === "200 OK") {
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
      <h2>Update Book</h2>
      <button onClick={() => nav("/home")}>Back</button>
      <div className="book-container">
        {books.length > 0
          ? books.map((b, index) => (
              <div className="book-card" key={b.ISBN}>
                <div className="field-row">
                  <label>ISBN</label>
                  <input type="text" value={b.ISBN} disabled />
                </div>

                <div className="field-row">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={b.title}
                    onChange={(e) => handleUpdate(e, index)}
                  />
                </div>

                <div className="field-row">
                  <label>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={b.author}
                    onChange={(e) => handleUpdate(e, index)}
                  />
                </div>

                <div className="field-row">
                  <label>Publication Year</label>
                  <input
                    type="text"
                    name="publicationYear"
                    value={b.publicationYear}
                    onChange={(e) => handleUpdate(e, index)}
                  />
                </div>
                <br />
                <button onClick={() => update(b)}>Update</button>
              </div>
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

export default UpdateBook;

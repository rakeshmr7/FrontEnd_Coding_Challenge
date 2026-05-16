import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const SignIn = () => {
  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!user.email || !user.password) {
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
      fetch("http://localhost:9000/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res.status === "401 UNAUTHORIZED") {
            Modal.error({
              title: res.message,
              content: "User with this email already exists!!",
              okText: "OK",
              okButtonProps: {
                style: {
                  backgroundColor: "#fc1c3d",
                  borderColor: "#fc1c3d",
                },
              },
            });
          } else if (res.status === "200 OK") {
            sessionStorage.setItem("currentUser", JSON.stringify(res.data));
            Modal.success({
              title: "Sign In Success",
              content: "Get started with Book Operations!!",
              okText: "OK",
              okButtonProps: {
                style: {
                  backgroundColor: "#19d250",
                  borderColor: "#19d250",
                },
              },
            });
            nav("/home");
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
      <h2>Book Management System</h2>

      <div className="container">
        {loading && (
          <Flex align="center" justify="center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </Flex>
        )}
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          onChange={handleInput}
        />
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={handleInput}
        />
        <button onClick={submit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>{" "}
        <h5>
          New User? <Link to="/signUp"> Sign Up</Link>
        </h5>
      </div>
    </>
  );
};

export default SignIn;

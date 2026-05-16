import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal, Spin } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";


const SignUp = () => {
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!user.name || !user.email || !user.password) {
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
      fetch("http://localhost:9000/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res.status === "409 CONFLICT") {
            Modal.error({
              title: "401 UNAUTHORIZED",
              content: res.message,
              okText: "OK",
              okButtonProps: {
                style: {
                  backgroundColor: "#fc1c3d",
                  borderColor: "#fc1c3d",
                },
              },
            });
          } else if (res.status === "201 CREATED") {
            Modal.success({
              title: "Sign Up Success",
              content: res.message,
              okText: "OK",
              okButtonProps: {
                style: {
                  backgroundColor: "#19d250",
                  borderColor: "#19d250",
                },
              },
            });
            nav("/signIn");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };
  return (<>
    <h2>Book Management System</h2>
    <div className="container">
      {loading && (
        <Flex align="center" justify="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      )}
      <input
        type="text"
        placeholder="Enter Name"
        name="name"
        onChange={handleInput}
      />
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>{" "}
      <h5>Already Registered?<Link to="/signIn"> Sign In</Link></h5>
    </div>
    </>
  );
};

export default SignUp;

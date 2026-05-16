import { Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Home from "./Home";
import AddBook from "./AddBook";
import RemoveBook from "./RemoveBook";
import UpdateBook from "./UpdateBook";
import SearchBook from "./SearchBook";

const RoutingConfig = () => {
    return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addBook" element={<AddBook />} />
        <Route path="/removeBook" element={<RemoveBook />} />
        <Route path="/updateBook" element={<UpdateBook />} />
        <Route path="/searchBook" element={<SearchBook />} />
      </Routes>
    );
}

export default RoutingConfig;
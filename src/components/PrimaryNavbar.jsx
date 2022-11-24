import {useContext} from "react";
import {Link} from "react-router-dom";
import {Button, Container, Nav, Navbar} from "react-bootstrap";

import {AuthContext} from "../context/AuthContext";

const PrimaryNavbar = () => {
  const {dispatch} = useContext(AuthContext);

  return (
    <Navbar bg="primary" className="navbar-dark" expand="lg">
      <Container>
        <Link
          to="/"
          style={{color: "white", fontSize: "24px", fontWeight: "bold"}}
        >
          <img
            src="/logo.png"
            alt="logo"
            style={{height: "35px", width: "35px", marginRight: "5px"}}
          />{" "}
          ToDo Clone
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{maxHeight: "100px"}}
            navbarScroll
          >
            <Link to="/" className="text-white my-2 mx-2">
              <i className="bi bi-house fs-4 me-2"></i>
              Home
            </Link>
            <Link to="/projects" className="text-white my-2 mx-2">
              <i className="bi bi-folder fs-4 me-2"></i>
              Projects
            </Link>
            <Button
              variant="outline-light"
              className="my-2 mx-2"
              style={{width: "fit-content"}}
              onClick={() => dispatch({type: "LOGOUT"})}
            >
              <i className="bi bi-box-arrow-right fs-4 me-2"></i> SIGN OUT
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PrimaryNavbar;

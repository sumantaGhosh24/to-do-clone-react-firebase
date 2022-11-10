import {useContext, useEffect, useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {Container, Row, Form, Col, Button} from "react-bootstrap";

import {auth} from "../firebase";
import {AuthContext} from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isEmpty = !email || !password;

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);

  useEffect(() => {
    document.title = "ToDo Clone - Login";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({type: "LOGIN", payload: user});
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Container>
      <Row>
        <Col
          md={{span: 10, offset: 1}}
          style={{minHeight: "100vh"}}
          className="d-flex align-items-center justify-content-center my-5"
        >
          <div
            className="d-flex align-items-center justify-content-center shadow-lg rounded p-5"
            style={{flexDirection: "column"}}
          >
            <h2 className="mb-4">Login to ToDo Clone</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">
                  <i className="bi bi-envelope fs-4"></i> Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">
                  <i className="bi bi-lock fs-4"></i> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                ></Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isEmpty}>
                <i className="bi bi-people fs-4"></i> Login
              </Button>
              {error && (
                <p
                  className="mt-4 text-danger text-center text-uppercase fw-bold p-1 rounded fs-6 font-monospace"
                  style={{backgroundColor: "#3a9191"}}
                >
                  {error}
                </p>
              )}
            </Form>
            <p className="mt-4 fs-5 text-capitalize fw-medium">
              Don't have an account?{" "}
              <Link to="/register" className="fw-bolder text-primary">
                Register
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

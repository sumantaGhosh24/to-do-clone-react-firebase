import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Container, Row, Form, Col, Button} from "react-bootstrap";

import {useFirebase} from "../firebase/AuthContext";

const Login = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Login";
  }, []);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!email || !password) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await firebase.signIn(email, password);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
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
                  name="email"
                  required
                />
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
                  name="password"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading}>
                <i className="bi bi-people fs-4"></i>{" "}
                {loading ? "Please Wait..." : "Login"}
              </Button>
              {error && (
                <p
                  className="mt-4 text-danger text-center text-uppercase fw-bold p-1 rounded fs-6 font-monospace"
                  style={{backgroundColor: "#ea9191"}}
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

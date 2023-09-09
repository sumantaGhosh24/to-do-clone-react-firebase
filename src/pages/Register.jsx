import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";

import {db} from "../firebase/firebase";
import {useFirebase} from "../firebase/AuthContext";
import {uploadImage} from "../firebase/storage";

const Register = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Register";
  }, []);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    country: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !data.username ||
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.password ||
        !data.address ||
        !data.country ||
        !file.name
      ) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        const imageUrl = await uploadImage(file, "users");
        const res = await firebase.signUp(data.email, data.password);
        const obj = {...data, imageUrl};
        delete obj.password;
        await setDoc(doc(db, "users", res.user.uid), {
          ...obj,
          timestamp: serverTimestamp(),
        });
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
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
            <h2 className="mb-4">Register to ToDo Clone</h2>
            <Image
              roundedCircle
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              className="w-25 h-25 mb-4 mx-auto"
            />
            <div className="mb-4">
              <label htmlFor="file">
                <p className="font-bold fw-bold">Upload Profile Image</p>{" "}
                <i className="bi bi-upload h-25 w-25 fs-2 d-block mx-auto"></i>
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="d-none"
              />
            </div>
            <Form onSubmit={handleRegister}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="username">
                      <i className="bi bi-person-circle fs-4"></i> Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      onChange={handleInput}
                      id="username"
                      name="username"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">
                      <i className="bi bi-person-badge-fill fs-4"></i> Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      onChange={handleInput}
                      id="name"
                      name="name"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">
                      <i className="bi bi-envelope fs-4"></i> Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email address"
                      onChange={handleInput}
                      id="email"
                      name="email"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="phone">
                      <i className="bi bi-telephone fs-4"></i> Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your phone number"
                      onChange={handleInput}
                      id="phone"
                      name="phone"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">
                  <i className="bi bi-lock fs-4"></i> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleInput}
                  id="password"
                  name="password"
                  required
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="address">
                      <i className="bi bi-geo-alt fs-4"></i> Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your address"
                      onChange={handleInput}
                      id="address"
                      name="address"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="country">
                      <i className="bi bi-map fs-4"></i> Country
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your country"
                      onChange={handleInput}
                      id="country"
                      name="country"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" disabled={loading}>
                <i className="bi bi-people fs-4"></i>{" "}
                {loading ? "Please Wait..." : "Register"}
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
              Already have an account?{" "}
              <Link to="/login" className="fw-bolder text-primary">
                Login
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

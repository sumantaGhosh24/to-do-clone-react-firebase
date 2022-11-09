import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";

import {auth, db, storage} from "../firebase";

const Register = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [per, setPer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ToDo Clone - Register";
  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          setError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({...prev, img: downloadURL}));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  console.log(`upload is ${per || "not"} running`);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const isMatch =
    !data.username ||
    !data.name ||
    !data.email ||
    !data.phone ||
    !data.password ||
    !data.address ||
    !data.country;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const obj = {...data};
      delete obj.password;
      await setDoc(doc(db, "users", res.user.uid), {
        ...obj,
        timestamp: serverTimestamp(),
      });
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      onChange={handleInput}
                      id="username"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      onChange={handleInput}
                      id="name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email address"
                      onChange={handleInput}
                      id="email"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="phone">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your phone number"
                      onChange={handleInput}
                      id="phone"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleInput}
                  id="password"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="address">Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your address"
                      onChange={handleInput}
                      id="address"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="country">Country</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your country"
                      onChange={handleInput}
                      id="country"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" disabled={isMatch}>
                Register
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

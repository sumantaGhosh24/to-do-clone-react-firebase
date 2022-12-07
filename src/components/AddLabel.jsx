import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import React, {useContext, useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";

import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";

const AddLabel = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const {currentUser} = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const isMatch = !data.title || !data.description || !data.color;

  const addLabel = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "labels"), {
        ...data,
        timestamp: serverTimestamp(),
        user: currentUser.uid,
      });
      setShow(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Col sm={{span: 8, offset: 4}}>
        <Button variant="primary" onClick={handleShow}>
          <i className="bi bi-pluse-lg me-2"></i> Create a Label
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Label</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addLabel}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">
                  <i className="bi bi-card-heading fs-4 me-2"></i>
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter label title"
                  onChange={handleInput}
                  id="title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">
                  <i className="bi bi-text-paragraph fs-4 me-2"></i>
                  Description
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter label description"
                  onChange={handleInput}
                  id="description"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="color">
                  <i className="bi bi-palette fs-4 me-2"></i>
                  Color
                </Form.Label>
                <Form.Control type="color" onChange={handleInput} id="color" />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={isMatch}
                className="me-3"
              >
                <i className="bi bi-tag-fill fs-4"></i> Add Label
              </Button>
              <Button variant="danger" onClick={handleClose}>
                <i className="bi bi-trash3-fill fs-4"></i>
                Close
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
          </Modal.Body>
        </Modal>
      </Col>
    </div>
  );
};

export default AddLabel;

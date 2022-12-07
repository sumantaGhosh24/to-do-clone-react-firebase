import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import React, {useContext, useState} from "react";
import {Button, Col, Collapse, Form, Row} from "react-bootstrap";

import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";

const AddTask = ({projectId}) => {
  const [data, setData] = useState({complete: false});
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const isMatch = !data.title || !data.description;

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), {
        ...data,
        projectId: projectId,
        user: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Row>
      <Button onClick={() => setOpen(true)}>Add Task</Button>
      <Collapse in={open} className="mt-5">
        <div>
          <Col sm={{span: 8, offset: 2}} className="shadow-lg p-3">
            <Form onSubmit={addTask}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">
                  <i className="bi bi-card-heading fs-4 me-2"></i> Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task title"
                  onChange={handleInput}
                  id="title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">
                  <i className="bi bi-text-paragraph fs-4 me-2"></i> Description
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task description"
                  onChange={handleInput}
                  id="description"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={isMatch}
                className="me-2"
              >
                <i className="bi bi-folder fs-4 me-2"></i> Add Task
              </Button>
              <Button
                variant="danger"
                className="me-2"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-trash3-fill fs-4 me-2"></i> Close
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
          </Col>
        </div>
      </Collapse>
    </Row>
  );
};

export default AddTask;

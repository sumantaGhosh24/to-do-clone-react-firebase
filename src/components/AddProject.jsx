import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";

import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";

const AddProject = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({favorite: false});
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState("");

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "labels"),
        where("user", "==", currentUser.uid),
        orderBy("timestamp")
      );
      onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()});
          setLabels(list);
        });
      });
    };
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const isMatch =
    !data.title || !data.description || !data.label || !data.color;

  const addProject = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        ...data,
        favorite: data.favorite === "true" ? true : false,
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
          <i className="bi bi-plus-lg me-2"></i> Create a Project
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addProject}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title">
                  <i className="bi bi-card-heading fs-4 me-2"></i> Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter project title"
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
                  placeholder="Enter project description"
                  onChange={handleInput}
                  id="description"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="color">
                  <i className="bi bi-palette fs-4 me-2"></i> Color
                </Form.Label>
                <Form.Control type="color" onChange={handleInput} id="color" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="label">
                  <i className="bi bi-tag fs-4 me-2"></i> Label
                </Form.Label>
                <Form.Select id="label" onChange={handleInput}>
                  <option value="default">No Label</option>
                  {labels.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 d-flex">
                <Form.Label htmlFor="label">
                  Make this project favorite
                </Form.Label>
                <Form.Select id="favorite" onChange={handleInput}>
                  <option value={true}>Favorite</option>
                  <option value={false}>Not Favorite</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={isMatch}
                className="me-2"
              >
                <i className="bi bi-folder fs-4 me-2"></i>Add Project
              </Button>
              <Button variant="danger" onClick={handleClose}>
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
          </Modal.Body>
        </Modal>
      </Col>
    </div>
  );
};

export default AddProject;

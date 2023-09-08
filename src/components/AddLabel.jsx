import {useState} from "react";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {Button, Col, Form, Modal} from "react-bootstrap";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const AddLabel = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({title: "", description: "", color: ""});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const firebase = useFirebase();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const addLabel = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!data.title || !data.description || !data.color) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await addDoc(collection(db, "labels"), {
          ...data,
          timestamp: serverTimestamp(),
          user: firebase.authUser,
        });
        setData({title: "", description: "", color: ""});
        setLoading(false);
        setShow(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Col>
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
                  name="title"
                  value={data.title}
                  required
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
                  name="description"
                  value={data.description}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="color">
                  <i className="bi bi-palette fs-4 me-2"></i>
                  Color
                </Form.Label>
                <Form.Control
                  type="color"
                  onChange={handleInput}
                  id="color"
                  name="color"
                  value={data.color}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="me-3"
              >
                <i className="bi bi-tag-fill fs-4"></i>{" "}
                {loading ? "Please Wait..." : "Add Label"}
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
    </>
  );
};

export default AddLabel;

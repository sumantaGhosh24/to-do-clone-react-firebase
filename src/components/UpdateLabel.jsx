import {useState, useEffect} from "react";
import {doc, getDoc, serverTimestamp, updateDoc} from "firebase/firestore";
import {Button, Form, Modal} from "react-bootstrap";

import {db} from "../firebase/firebase";

const UpdateLabel = ({id}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "labels", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({id: docSnap.id, ...docSnap.data()});
      }
    };
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!data.title || !data.description || !data.color) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError("");
        await updateDoc(
          doc(db, "labels", data.id),
          {...data, timestamp: serverTimestamp()},
          {merge: true}
        );
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
      <Button variant="info" onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Label</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="title">
                <i className="bi bi-card-heading fs-4 me-2"></i>Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter label title"
                value={data.title}
                onChange={handleInput}
                id="title"
                name="title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="description">
                <i className="bi bi-text-paragraph fs-4 me-2"></i>Description
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter label description"
                value={data.description}
                onChange={handleInput}
                id="description"
                name="description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="color">
                <i className="bi bi-palette fs-4 me-2"></i>Color
              </Form.Label>
              <Form.Control
                type="color"
                value={data.color}
                onChange={handleInput}
                id="color"
                name="color"
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
              {loading ? "Please Wait..." : "Update Label"}
            </Button>
            <Button variant="danger" onClick={handleClose}>
              <i className="bi bi-trash3-fill fs-4"></i> Close
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
    </>
  );
};

export default UpdateLabel;

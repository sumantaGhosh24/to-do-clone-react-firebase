import {useEffect, useState} from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {Button, Col, Form, Modal} from "react-bootstrap";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const AddProject = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    favorite: false,
    title: "",
    description: "",
    color: "",
    label: "",
  });
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "labels"),
        where("user", "==", firebase.authUser),
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
  }, [firebase.authUser]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const addProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !data.title ||
        !data.description ||
        !data.color ||
        !data.label ||
        !data.favorite
      ) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await addDoc(collection(db, "projects"), {
          ...data,
          favorite: data.favorite === "true" ? true : false,
          timestamp: serverTimestamp(),
          user: firebase.authUser,
        });
        setData({
          favorite: false,
          title: "",
          description: "",
          color: "",
          label: "",
        });
        setLoading(false);
        setShow(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Col>
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
                  name="title"
                  value={data.title}
                  required
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
                  name="description"
                  value={data.description}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="color">
                  <i className="bi bi-palette fs-4 me-2"></i> Color
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
              <Form.Group className="mb-3">
                <Form.Label htmlFor="label">
                  <i className="bi bi-tag fs-4 me-2"></i> Label
                </Form.Label>
                <Form.Select
                  id="label"
                  name="label"
                  value={data.label}
                  onChange={handleInput}
                  required
                >
                  <option value="default">No Label</option>
                  {labels.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="label">
                  Make this project favorite
                </Form.Label>
                <Form.Select
                  id="favorite"
                  name="favorite"
                  value={data.favorite}
                  onChange={handleInput}
                  required
                >
                  <option value={true}>Favorite</option>
                  <option value={false}>Not Favorite</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="me-2"
              >
                <i className="bi bi-folder fs-4 me-2"></i>
                {loading ? "Please Wait..." : "Add Project"}
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

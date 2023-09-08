import {useState, useEffect} from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {Button, Form, Modal} from "react-bootstrap";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const UpdateProject = ({id}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [labels, setLabels] = useState([]);
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

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({id: docSnap.id, ...docSnap.data()});
      }
    };
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!data.title || !data.description || !data.label || !data.color) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await updateDoc(
          doc(db, "projects", data.id),
          {
            ...data,
            timestamp: serverTimestamp(),
            favorite: data.favorite === "true" ? true : false,
          },
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
          <Modal.Title>Update Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
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
                onChange={handleInput}
                value={data.label}
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
                onChange={handleInput}
                value={data.favorite}
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
              className="me-3"
            >
              <i className="bi bi-tag-fill fs-4 me-2"></i>{" "}
              {loading ? "Please Wait..." : "Update Project"}
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
    </>
  );
};

export default UpdateProject;

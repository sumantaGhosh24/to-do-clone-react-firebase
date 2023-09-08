import {useState} from "react";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {Button, Col, Collapse, Form, Row} from "react-bootstrap";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const AddTask = ({projectId}) => {
  const [data, setData] = useState({
    complete: false,
    title: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const firebase = useFirebase();

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!data.title || !data.description) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await addDoc(collection(db, "tasks"), {
          ...data,
          projectId: projectId,
          user: firebase.authUser,
          timestamp: serverTimestamp(),
        });
        setData({complete: false, title: "", description: ""});
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
                  value={data.title}
                  id="title"
                  name="title"
                  required
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
                  value={data.description}
                  id="description"
                  name="description"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="me-2"
              >
                <i className="bi bi-folder fs-4 me-2"></i>{" "}
                {loading ? "Please Wait..." : "Add Task"}
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

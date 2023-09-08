import {useEffect, useState} from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";
import {
  AddProject,
  LabelBadge,
  PrimaryNavbar,
  Sidebar,
  TopAlert,
  UpdateProject,
} from "../components";

const Projects = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Projects";
  }, []);

  const [project, setProject] = useState([]);
  const [error, setError] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const firebase = useFirebase();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = async () => {
      const q = query(
        collection(db, "projects"),
        where("user", "==", firebase.authUser),
        orderBy("timestamp")
      );
      onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()});
          setProject(list);
        });
      });
    };
    return () => {
      unsubscribe();
    };
  });

  const handleDelete = async (id) => {
    try {
      const batch1 = writeBatch(db);
      const q1 = query(
        collection(db, "tasks"),
        where("projectId", "==", id),
        where("user", "==", firebase.authUser)
      );
      const querySnapshot1 = await getDocs(q1);
      if (!querySnapshot1.empty) {
        querySnapshot1.forEach((doc) => {
          batch1.delete(doc.ref);
        });
        batch1.commit();
      }
      await deleteDoc(doc(db, "projects", id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <PrimaryNavbar />
      <Sidebar openSidebar={openSidebar} />
      <Button
        variant="primary"
        size="lg"
        style={{
          position: "fixed",
          left: openSidebar ? 300 : 0,
          zIndex: "99999",
          marginTop: "20px",
          marginLeft: "20px",
          transitionProperty: "all",
          transitionDuration: ".5s",
          transitionTimingFunction: "ease-in-out",
        }}
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        {openSidebar ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-list"></i>
        )}
      </Button>
      {error && <TopAlert message={error} />}
      <Container className="mt-4">
        <Row className="mb-5">
          <AddProject />
        </Row>
        <Row>
          <Col>
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Favorite</th>
                  <th>Label</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      You don't create a project yet, please create one to
                      manage it.
                    </td>
                  </tr>
                )}
                {project.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      <div
                        style={{
                          height: "40px",
                          width: "60px",
                          background: item.color,
                          borderRadius: 10,
                        }}
                      />
                    </td>
                    <td>{item.favorite ? "Favorite" : "Not Favorite"}</td>
                    <td>
                      <LabelBadge id={item.label} />
                    </td>
                    <td>
                      {new Date(item.timestamp?.seconds * 1000).toString()}
                    </td>
                    <td>
                      <Button
                        variant="success"
                        className="me-2 mb-2"
                        onClick={() => navigate(`/projects/${item.id}`)}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="me-2 mb-2"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-archive"></i>
                      </Button>
                      <UpdateProject id={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Projects;

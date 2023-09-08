import {useState, useEffect} from "react";
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

import {
  AddLabel,
  PrimaryNavbar,
  Sidebar,
  TopAlert,
  UpdateLabel,
} from "../components";
import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const Labels = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Labels";
  }, []);

  const [labels, setLabels] = useState([]);
  const [error, setError] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const navigate = useNavigate();

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = async () => {
      const q = query(
        collection(db, "labels"),
        where("user", "==", firebase.authUser),
        orderBy("timestamp")
      );
      onSnapshot(q, (querySnapshot) => {
        let labels = [];
        querySnapshot.forEach((doc) => {
          labels.push({id: doc.id, ...doc.data()});
          setLabels(labels);
        });
      });
    };
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  const handleDelete = async (id) => {
    try {
      const q = query(collection(db, "projects"), where("label", "==", id));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, {label: "default"});
        });
        batch.commit();
      }
      await deleteDoc(doc(db, "labels", id));
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
      <Container className="mt-5">
        <Row className="mb-5">
          <AddLabel />
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
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labels.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      You don't create a label yet, please create one to manage
                      it.
                    </td>
                  </tr>
                )}
                {labels.map((item, index) => (
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
                      ></div>
                    </td>
                    <td>
                      {new Date(item.timestamp?.seconds * 1000).toString()}
                    </td>
                    <td>
                      <Button
                        variant="success"
                        className="me-2 mb-2"
                        onClick={() => navigate(`/labels/${item.id}`)}
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
                      <UpdateLabel id={item.id} />
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

export default Labels;

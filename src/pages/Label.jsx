import {useEffect, useState} from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";

import {PrimaryNavbar, Sidebar, TopAlert} from "../components";
import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const Label = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Label";
  }, []);

  const [label, setLabel] = useState({});
  const [project, setProject] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);

  const navigate = useNavigate();
  const {labelId} = useParams();

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "labels", labelId);
      const docSnap = await getDoc(docRef);
      setLabel({id: docSnap.id, ...docSnap.data()});
    };
    return () => {
      unsubscribe();
    };
  }, [labelId]);

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "projects"),
        where("label", "==", labelId),
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
  }, [firebase.authUser, labelId]);

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
      {label.user === firebase.authUser ? (
        <>
          <Container className="mt-4">
            <Row className="mb-5">
              <Col sm={{span: 10, offset: 1}}>
                <Card
                  border="light"
                  className="shadow-lg"
                  style={{padding: 20}}
                >
                  <Card.Text>Label : {label.title}</Card.Text>
                  <Card.Text>Description : {label.description}</Card.Text>
                  <Card.Text>
                    Timestamp :{" "}
                    {new Date(label.timestamp?.seconds * 1000).toString()}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    Color :
                    <span
                      style={{
                        height: "40px",
                        width: "60px",
                        background: label.color,
                        borderRadius: 10,
                        display: "inline-block",
                        marginLeft: 20,
                      }}
                    ></span>
                  </Card.Text>
                </Card>
              </Col>
            </Row>
            <Row className="mb-5">
              <h1 className="text-center">Projects of this Label</h1>
              <Col md={{span: 10, offset: 1}}>
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Color</th>
                      <th>Favorite</th>
                      <th>Timestamp</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.length === 0 && (
                      <tr>
                        <td colSpan={7}>No project have this label.</td>
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
                          ></div>
                        </td>
                        <td>{item.favorite ? "Favorite" : "Not Favorite"}</td>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <TopAlert message="Only creator of this label, can access this page." />
      )}
    </>
  );
};

export default Label;

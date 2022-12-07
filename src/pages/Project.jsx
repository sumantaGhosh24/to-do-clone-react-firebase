import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";

import {
  AddTask,
  LabelBadge,
  PrimaryNavbar,
  Sidebar,
  Task,
  TopAlert,
} from "../components";
import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";

const Project = () => {
  const [project, setProject] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
  const [tasks, setTasks] = useState([]);

  const {projectId} = useParams();

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "ToDo Clone - Project";
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);
      setProject({id: docSnap.id, ...docSnap.data()});
    };
    return () => {
      unsubscribe();
    };
  }, [projectId]);

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "tasks"),
        where("user", "==", currentUser.uid),
        where("projectId", "==", projectId),
        orderBy("timestamp")
      );
      onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({id: doc.id});
          setTasks(list);
        });
      });
    };
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid, projectId]);

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
      {project.user === currentUser.uid ? (
        <>
          <Container className="mt-4">
            <Row className="mb-5">
              <Col sm={{span: 8, offset: 2}} className="shadow-lg p-3">
                <h2 className="fs-3 font-bold">{project.title}</h2>
                <p className="fs-5">{project.description}</p>
                <LabelBadge id={project.label} />
                <p className="fs-5 text-muted">
                  Timestamp:{" "}
                  {new Date(project.timestamp?.seconds * 1000).toString()}
                </p>
              </Col>
            </Row>
            <Row className="mb-5">
              <Col sm={{span: 8, offset: 2}}>
                <AddTask projectId={projectId} />
                {tasks.length === 0 && (
                  <h2 className="text-center mt-5">
                    This project have not any task.
                  </h2>
                )}
                {tasks.map((item) => (
                  <Task data={item.id} key={item.id} />
                ))}
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <TopAlert message="Only creator of this project, can access this page." />
      )}
    </>
  );
};

export default Project;

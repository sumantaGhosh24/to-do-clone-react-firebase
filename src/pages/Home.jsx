import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {Button, Col, Container, Row} from "react-bootstrap";

import {
  PrimaryNavbar,
  Sidebar,
  HomeCard,
  Profile,
  TopAlert,
} from "../components";
import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const Home = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Home";
  }, []);

  const [project, setProject] = useState(0);
  const [favoriteProject, setFavoriteProject] = useState(0);
  const [labels, setLabels] = useState(0);
  const [error, setError] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = async () => {
      const projectRef = collection(db, "projects");
      const q = query(projectRef, where("user", "==", firebase.authUser));
      const querySnapshot = await getDocs(q);
      let list = [];
      querySnapshot.forEach(
        (doc) => {
          list.push({id: doc.id});
          setProject(list.length);
        },
        (error) => {
          setError(error.message);
        }
      );
    };
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  useEffect(() => {
    const unsubscribe = async () => {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("user", "==", firebase.authUser),
        where("favorite", "==", true)
      );
      const querySnapshot = await getDocs(q);
      let list = [];
      querySnapshot.forEach(
        (doc) => {
          list.push({id: doc.id});
          setFavoriteProject(list.length);
        },
        (error) => {
          setError(error.message);
        }
      );
    };
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  useEffect(() => {
    const unsubscribe = async () => {
      const labelRef = collection(db, "labels");
      const q = query(labelRef, where("user", "==", firebase.authUser));
      const querySnapshot = await getDocs(q);
      let list = [];
      querySnapshot.forEach(
        (doc) => {
          list.push({id: doc.id});
          setLabels(list.length);
        },
        (error) => {
          setError(error.message);
        }
      );
    };
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

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
        <Row>
          <Col md="6">
            <Profile />
          </Col>
          <Col md="6">
            <Row>
              <Col className="mx-3 my-3">
                <HomeCard
                  heading="Total Project"
                  subHeading="The total number of project created by user"
                  value={project}
                  linkTo="/projects"
                />
              </Col>
              <Col className="mx-3 my-3">
                <HomeCard
                  heading="Favorite Project"
                  subHeading="The total number of favorite project create by user"
                  value={favoriteProject}
                  linkTo="/projects"
                />
              </Col>
            </Row>
            <Row>
              <Col className="mx-3 my-3">
                <HomeCard
                  heading="Total Label"
                  subHeading="The total number of label created by user"
                  value={labels}
                  linkTo="/labels"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

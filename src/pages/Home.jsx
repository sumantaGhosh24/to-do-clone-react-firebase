import {useContext, useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {Button, Col, Container, Row} from "react-bootstrap";

import {
  PrimaryNavbar,
  Sidebar,
  HomeCard,
  Profile,
  TopAlert,
} from "../components";
import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";

const Home = () => {
  const [project, setProject] = useState(0);
  const [favoriteProject, setFavoriteProject] = useState(0);
  const [error, setError] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "ToDo Clone - Home";
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const projectRef = collection(db, "projects");
      const q = query(projectRef, where("user", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      let list = [];
      querySnapshot.forEach(
        (doc) => {
          list.push({id: doc.id});
          setProject(list.length);
        },
        (error) => {
          setError(error);
        }
      );
    };
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  useEffect(() => {
    const unsubscribe = async () => {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("user", "==", currentUser.uid),
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
          setError(error);
        }
      );
    };
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

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
        <Row>
          <Col md="6">
            <Profile />
          </Col>
          <Col md="6">
            <Row>
              <Col className="mb-4">
                <HomeCard
                  heading="Total Project"
                  subHeading="The total number of project created by user"
                  value={project}
                  linkTo="/projects"
                />
              </Col>
              <Col>
                <HomeCard
                  heading="Favorite Project"
                  subHeading="The total number of favorite project create by user"
                  value={favoriteProject}
                  linkTo="/projects"
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

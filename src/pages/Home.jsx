import {useContext, useEffect, useState} from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {Col, Container, Row} from "react-bootstrap";

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

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "ToDo Clone - Home";
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "projects"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id});
            setProject(list.length);
          },
          (error) => {
            setError(error);
          }
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  useEffect(() => {
    const unsubscribe = async () => {
      const projectsRef = collection(db, "users", currentUser.uid, "projects");
      const q = query(projectsRef, where("favorite", "==", true));
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
      <Sidebar />
      {error && <TopAlert message={error} />}
      <Container>
        <Profile />
        <Row>
          <Col>
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
      </Container>
    </>
  );
};

export default Home;

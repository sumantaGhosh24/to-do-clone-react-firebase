import {useEffect, useState} from "react";
import {collection, doc, onSnapshot, where, query} from "firebase/firestore";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

import {useFirebase} from "../firebase/AuthContext";
import {db} from "../firebase/firebase";

const Sidebar = ({openSidebar}) => {
  const [user, setUser] = useState({});
  const [project, setProject] = useState([]);
  const [favoriteProject, setFavoriteProject] = useState([]);

  const firebase = useFirebase();

  const handleLogout = async () => {
    try {
      await firebase.handleLogout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", firebase.authUser),
      (doc) => {
        setUser(doc.data());
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  useEffect(() => {
    const unsubscribe = async () => {
      const q = query(
        collection(db, "projects"),
        where("user", "==", firebase.authUser),
        where("favorite", "==", false)
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
  }, [firebase.authUser]);

  useEffect(() => {
    async function unsubscribe() {
      const q = query(
        collection(db, "projects"),
        where("user", "==", firebase.authUser),
        where("favorite", "==", true)
      );
      onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()});
          setFavoriteProject(list);
        });
      });
    }
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  return (
    <section
      style={{
        opacity: openSidebar ? 1 : 0,
        display: openSidebar ? "block" : "none",
        transitionProperty: "all",
        transitionDuration: ".5s",
        transitionTimingFunction: "ease-in-out",
        backgroundColor: "#0d6efd",
        position: "absolute",
        height: "90vh",
        width: "300px",
        borderRadius: "7px",
        zIndex: "99999",
        marginTop: "20px",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <img
            src={user.imageUrl}
            alt={user.name}
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "100px",
              marginBottom: "20px",
            }}
          />
          <h2
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              fontSize: "22px",
              textTransform: "capitalize",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {user.name}
          </h2>
          <h3 style={{fontSize: "16px", color: "white"}}>
            <i className="bi bi-person-circle fs-5 fw-bold me-1"></i>{" "}
            <span className="fw-bold">Username : </span>
            {user.username}
          </h3>
          <h3
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              fontSize: "16px",
              color: "white",
            }}
          >
            <i className="bi bi-envelope fs-4 fw-bold me-1"></i>{" "}
            <span className="fw-bold">Email : </span> {user.email}
          </h3>
          <h3 style={{fontSize: "16px", color: "white"}}>
            <i className="bi bi-telephone fs-4 fw-bold me-1"></i>{" "}
            <span className="fw-bold">Phone : </span> {user.phone}
          </h3>
          <h3
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              fontSize: "16px",
              color: "white",
            }}
          >
            <i className="bi bi-geo-alt fs-4 fw-bold me-1"></i>{" "}
            <span className="fw-bold">Address : </span> {user.address}
          </h3>
          <h3 style={{fontSize: "16px", color: "white"}}>
            <i className="bi bi-map fs-4 fw-bold me-1"></i>{" "}
            <span className="fw-bold">Country : </span> {user.country}
          </h3>
          <Button
            variant="danger"
            onClick={handleLogout}
            style={{marginBottom: "20px", marginTop: "20px"}}
          >
            <i className="bi bi-box-arrow-right fs-4 me-2"></i>
            LOGOUT
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <Link
            to="/labels"
            style={{
              marginBlock: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            All Labels
          </Link>
          <Link
            to="/projects"
            style={{
              marginBlock: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            All Project
          </Link>
          <p style={{fontSize: "16px", color: "white", marginBlock: "5px"}}>
            Favorite Project
          </p>
          {favoriteProject.length === 0 && (
            <p style={{fontSize: "14px", color: "white"}}>
              You not have a favorite project yet.
            </p>
          )}
          {favoriteProject.map((item, index) => (
            <Link
              to={`/projects/${item.id}`}
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "60%",
              }}
            >
              <p
                style={{
                  height: "15px",
                  width: "15px",
                  borderRadius: "50px",
                  backgroundColor: `${item.color}`,
                  marginRight: "10px",
                }}
              ></p>
              <p
                style={{
                  fontSize: "16px",
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {item.title}
              </p>
            </Link>
          ))}
          <p style={{fontSize: "16px", color: "white", marginBlock: "5px"}}>
            Project
          </p>
          {project.length === 0 && (
            <p style={{fontSize: "14px", color: "white"}}>
              You not have a project yet.
            </p>
          )}
          {project.map((item, index) => (
            <Link
              to={`/projects/${item.id}`}
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "60%",
              }}
            >
              <p
                style={{
                  height: "15px",
                  width: "15px",
                  borderRadius: "50px",
                  backgroundColor: `${item.color}`,
                  marginRight: "10px",
                }}
              ></p>
              <p
                style={{
                  fontSize: "16px",
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;

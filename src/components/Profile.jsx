import {useContext, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";

import {AuthContext} from "../context/AuthContext";
import {db} from "../firebase";
import {Button, Card} from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState({});

  const {currentUser, dispatch} = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setUser(doc.data());
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  return (
    <Card style={{marginBottom: "50px"}} className="shadow-lg">
      <Card.Img
        variant="top"
        src={
          user.img
            ? user.img
            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
        }
        style={{height: "250px"}}
      />
      <Card.Body>
        <Card.Title className="text-capitalize fw-bold mb-3">
          {user.name}
        </Card.Title>
        <Card.Text>
          <i className="bi bi-person-circle fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Username : </span>
          {user.username}
        </Card.Text>
        <Card.Text>
          <i className="bi bi-envelope fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Email : </span> {user.email}
        </Card.Text>
        <Card.Text>
          <i className="bi bi-telephone fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Phone : </span> {user.phone}
        </Card.Text>
        <Card.Text className="text-capitalize">
          <i className="bi bi-geo-alt fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Address : </span> {user.address}
        </Card.Text>
        <Card.Text className="text-capitalize">
          <i className="bi bi-map fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Country : </span> {user.country}
        </Card.Text>
        <Card.Text>
          <i className="bi bi-alarm fs-4 fw-bold me-2"></i>{" "}
          <span className="fw-bold">Register Date : </span>
          {new Date(user.timestamp?.seconds * 1000).toString()}
        </Card.Text>
        <Button variant="danger" onClick={() => dispatch({type: "LOGOUT"})}>
          <i className="bi bi-box-arrow-right fs-4 me-2"></i>
          Logout
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Profile;

import {
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

import {db} from "../firebase";
import TopAlert from "./TopAlert";
import UpdateTask from "./UpdateTask";

const Task = ({data}) => {
  const [task, setTask] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      onSnapshot(doc(db, "tasks", data), (doc) => {
        setTask({id: doc.id, ...doc.data()});
      });
    };
    return () => {
      unsubscribe();
    };
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        ...task,
        complete: !task.complete,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className={`my-3 shadow-lg p-3 rounded ${!task.complete && "bg-primary"}`}
    >
      {error && <TopAlert message={error} />}
      <h3 className="fs-4">{task.title}</h3>
      <p className="fs-6">{task.description}</p>
      <Button
        variant="success"
        className="me-2 mb-2"
        onClick={() => handleComplete(task.id)}
      >
        <i className="bi bi-check"></i>
      </Button>
      <Button
        variant="danger"
        className="me-2 mb-2"
        onClick={() => handleDelete(task.id)}
      >
        <i className="bi bi-archive"></i>
      </Button>
      <UpdateTask id={task.id} />
    </div>
  );
};

export default Task;

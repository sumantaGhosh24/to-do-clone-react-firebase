import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";

import {db} from "../firebase/firebase";

const LabelBadge = ({id}) => {
  const [label, setLabel] = useState({});

  useEffect(() => {
    const unsubscribe = async () => {
      onSnapshot(doc(db, "labels", id), (docSnap) => {
        setLabel({id: docSnap.id, ...docSnap.data()});
      });
    };
    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <>
      {label ? (
        <div
          style={{background: label.color, borderRadius: 10}}
          className="d-flex p-1"
        >
          <i className="bi bi-tag text-white fs-4 me-2"></i>
          <p className="text-white">{label.title}</p>
        </div>
      ) : (
        <div
          style={{background: "black", borderRadius: 10}}
          className="d-flex p-1"
        >
          <i className="bi bi-tag text-white fs-4 me-2"></i>
          <p className="text-white">No Label</p>
        </div>
      )}
    </>
  );
};

export default LabelBadge;

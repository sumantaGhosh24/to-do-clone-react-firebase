import {doc, getDoc} from "firebase/firestore";
import React, {useEffect, useState} from "react";

import {db} from "../firebase";

const LabelBadge = ({id}) => {
  const [label, setLabel] = useState({});

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "labels", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLabel({id: docSnap.id, ...docSnap.data()});
      }
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

import {useState} from "react";
import {Alert, Button} from "react-bootstrap";

const TopAlert = ({message}) => {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        dismissible
        className="mx-5"
      >
        <Alert.Heading>
          Something Went Wrong! Please Try Again Later!
        </Alert.Heading>
        <p>{message}</p>
      </Alert>
    );
  }
};

export default TopAlert;

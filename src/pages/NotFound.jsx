import {useEffect} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Page Not Found";
  }, []);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{height: "100vh", width: "100vw"}}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded shadow-lg p-4 text-center"
        style={{flexDirection: "column", height: "50%", width: "70%"}}
      >
        <h1 className="mb-5">404 || Page Not Found</h1>
        <p className="mb-5 text-capitalize fw-bold text-muted">
          this page not exist, please back to home page to access our
          application.
        </p>
        <Button variant="primary">
          <Link to="/" className="text-light">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

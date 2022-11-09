import {useEffect} from "react";
import {Link} from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "ToDo Clone - Page Not Found";
  }, []);

  return (
    <div>
      <div>
        <h1>404 || Page Not Found</h1>
        <p>
          this page not exist, please back to home page to access our
          application.
        </p>
        <button>
          <Link to="/">Back to Home</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFound;

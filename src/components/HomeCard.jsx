import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

const HomeCard = ({heading, subHeading, value, linkTo}) => {
  return (
    <>
      <Card border="light" style={{width: "18rem"}} className="shadow-lg">
        <Card.Header>{heading}</Card.Header>
        <Card.Body>
          <Card.Title>{subHeading}</Card.Title>
          <Card.Text>{value}</Card.Text>
          <Button variant="primary">
            <Link to={linkTo} style={{color: "white", textDecoration: "none"}}>
              Explore More
            </Link>
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default HomeCard;

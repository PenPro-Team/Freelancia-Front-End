import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Cards = ({ title, pragraph }) => {
  // Destructure to easily use

  return (
    <div className="col mt-5">
      <div className="card-body">
        <div className="card" style={{ maxWidth: 20 + "rem" }}>
          <div className="card-body text-center">
            <h4 className="card-title">{title}</h4>
            <p>{pragraph}</p>
          </div>
          {/* <img className="" src={img1} alt="" /> */}
        </div>
      </div>
    </div>
  );
};

export default Cards;

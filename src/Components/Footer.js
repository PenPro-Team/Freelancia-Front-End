import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => {
  // Contact
  return (
    <>
      <div className="container-fluid blackBack mt-5 p-5">
        <div className="d-flex text-light flex-wrap flex-column flex-lg-row ">
          <div className="col-12 col-md-6 mb-3 mb-1 ">
            <h2>Lat's Take</h2>
            <p>
              Evrey Project Starts with a chat. Joven leads our client converstation <br/> and will be happy to discuss your Project. He will also Pull in the Right <br/> people from the team when needed
            </p>
            <button className="btn btn-primary w-50">Tell Us about your Project</button>
          </div>
          <div className="col-3">
          <p>Our Responsers</p>
            <Link className="text-decoration-none text-primary" to="">Links</Link>
            <br />
            <Link className="text-decoration-none text-primary" to="">Home</Link>
            <br />
            <Link className="text-decoration-none text-primary" to="">Portfolio</Link>
          </div>
          <div className="col-3">
            <br/>
            <div className="d-flex">
              <input type="text" placeholder="Take a look in PlateForm" className="form-control w-100"/><button className="btn btn-primary ms-2">Search</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

{
  /* <Row className='blackBack text-light'>
                    <div className='d-flex justify-content-center'>
                       <Col>1 of 3</Col>
                        <Col>2 of 3</Col>
                        <Col>3 of 3</Col> 
                    </div>
                    
</Row> */
}

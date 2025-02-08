import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => {
  // Contact
  return (
    <>
      <div className='container-fluid blackBack mt-5'>
                <div className='d-flex row text-light text-center'>
                    <div className='col-4'>
                       <p>mohamed</p>
                       <Link to="">Links</Link><br/>
                       <Link to="">Home</Link><br/>
                       <Link to="">Portfolio</Link>
                    </div>
                    <div className='col-4'>
                       <p>Jack</p>
                       <Link to="">Links</Link><br/>
                       <Link to="">Home</Link><br/>
                       <Link to="">Portfolio</Link>
                    </div>
                    <div className='col-4'>
                       <p>Abdo</p>
                       <Link to="">Links</Link><br/>
                       <Link to="">Home</Link><br/>
                       <Link to="">Portfolio</Link>
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

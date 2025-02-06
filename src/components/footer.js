import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => { // Contact 
    return (
        <>
            <div className='container-fluid blackBack'>
                <div className='d-flex row text-light text-center'>
                    <div className='col-4'>
                       <p>mohamed</p>
                    </div>
                    <div className='col-4'>
                       <p>Jack</p>
                    </div>
                    <div className='col-4'>
                       <p>Abdo</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;

{/* <Row className='blackBack text-light'>
                    <div className='d-flex justify-content-center'>
                       <Col>1 of 3</Col>
                        <Col>2 of 3</Col>
                        <Col>3 of 3</Col> 
                    </div>
                    
</Row> */}
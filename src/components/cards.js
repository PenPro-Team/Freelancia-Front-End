import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import img1 from './../assets/category-tiles-wordpress-81f6cf6d35ddcf9be55d8d515d7772a57f45fa280dd5ae187bd93db56916228c.avif'

const Cards = ({title,pragraph}) => { // Destructure to easily use
    
    return (
                <div class="col mt-5">
                        <div className="card-body">
                            <div className="card" style={{maxWidth: 20 +'rem',height:23+'vh'}}>
                                    <div className="card-body text-center">
                                            <h4 className="card-title">{title}</h4>
                                            <p>{pragraph}</p>
                                            <div>
                                                <a className='me-1'>Newest</a>
                                                <a className=''>Bestsellers</a>
                                            </div>
                                            
                                    </div>
                                {/* <img className="" src={img1} alt="" /> */}
                            </div>
                        </div>
                </div>
        
    )
}

export default Cards;

import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { getFromLocalStorage } from '../network/local/LocalStorage';
import { useNavigate } from 'react-router-dom';
const ContractCard = ({ contract }) => {
    const current_user = getFromLocalStorage("auth");
    const navigate = useNavigate();
    const getStatusBadgeVariant = (status) => {
        switch (status) {
          case 'pending': return 'warning';
          case 'active': return 'success';
          case 'completed': return 'info';
          case 'cancelled': return 'danger';
          default: return 'secondary';
        }
      };
      // Remove this console.log in production
      console.log(contract);
      return (
        <Card className="mb-4 contract-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{contract.project_details.project_name}</h5>
            <Badge bg={getStatusBadgeVariant(contract.contract_state)}>
              {contract.contract_state}
            </Badge>
          </Card.Header>
          
          <Card.Body>
            <Row>
              <Col md={8}>
                <p><strong>Deadline:</strong> {contract.deadline} days</p>
                <p><strong>Budget:</strong> {contract.budget} $</p>
                <p><strong>Created:</strong> {new Date(contract.created_at).toLocaleDateString()}</p>
              </Col>
              <Col md={4}>
              {
                current_user.user.role === 'client' ?   <div className="freelancer-info text-center">
                <h6>Freelancer</h6>
                <div className="avatar-container mb-2">
                  <img 
                    src={`${contract.freelancer_details.image}`} 
                    alt={`${contract.freelancer_details.first_name} ${contract.freelancer_details.last_name}`}
                    className="rounded-circle"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                </div>
                <p>{contract.freelancer_details.first_name} {contract.freelancer_details.last_name}</p>
              </div>:
                <div className="client-info text-center">
                  <h6>Client</h6>
                  <div className="avatar-container mb-2">
                    <img 
                      src={`${contract.client_details.image}`} 
                      alt={`${contract.client_details.first_name} ${contract.client_details.last_name}`}
                      className="rounded-circle"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </div>
                  <p>{contract.client_details.first_name} {contract.client_details.last_name}</p>
                </div>
              }
              
              </Col>
            </Row>
          </Card.Body>
          
          <Card.Footer className="d-flex justify-content-end">
            <Button 
              onClick={() => navigate(`/Freelancia-Front-End/contractDetails/${contract.id}`)}
            variant="outline-primary"
             size="sm" className="me-2">View Details</Button>
       
          </Card.Footer>
          </Card>
        );
  };
  
  export default ContractCard;
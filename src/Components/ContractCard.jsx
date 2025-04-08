import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { getFromLocalStorage } from '../network/local/LocalStorage';
import { useNavigate } from 'react-router-dom';
import PersonalImg from '../assets/default-user.png';
import { useTranslation } from 'react-i18next';

const ContractCard = ({ contract }) => {
    const current_user = getFromLocalStorage("auth");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const getStatusBadgeVariant = (status) => {
        switch (status) {
          case 'pending': return 'warning';
          case 'Accepted': return 'success';
          case 'Completed': return 'info';
          case 'canceled': return 'danger';
          default: return 'secondary';
        }
      };
      // Remove this console.log in production
      console.log(contract);
      return (
        <Card className="mb-4 contract-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('contracts.title')}</h5>
            <Badge bg={getStatusBadgeVariant(contract.contract_state)}>
              {t(`contracts.status.${contract.contract_state}`)}
            </Badge>
          </Card.Header>
          
          <Card.Body>
            <Row>
              <Col md={8}>
                <p><strong>{t('contracts.deadline')}:</strong> {contract.deadline} {t('contracts.days')}</p>
                <p><strong>{t('contracts.budget')}:</strong> ${contract.budget}</p>
                <p><strong>{t('contracts.created')}:</strong> {new Date(contract.created_at).toLocaleDateString()}</p>
              </Col>
              <Col md={4}>
              {
                current_user.user.role === 'client' ?   <div className="freelancer-info text-center">
                <h6>{t('contracts.freelancer')}</h6>
                <div className="avatar-container mb-2">
                <img 
                          src={contract.freelancer_details.image?contract.freelancer_details.image:PersonalImg} 
                          alt={`${contract.freelancer_details.first_name.charAt(0)} ${contract.freelancer_details.last_name.charAt(0)}`}
                          className="rounded-circle"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                </div>
                <p>{contract.freelancer_details.first_name} {contract.freelancer_details.last_name}</p>
              </div>:
                <div className="client-info text-center">
                  <h6>{t('contracts.client')}</h6>
                  <div className="avatar-container mb-2">
                  <img 
                                                src={contract.client_details.image ? contract.client_details.image : PersonalImg}
                                                alt={`${contract.client_details.first_name} ${contract.client_details.last_name}`}
                                                className="rounded-circle"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
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
             size="sm" className="me-2">{t('contracts.viewDetails')}</Button>
       
          </Card.Footer>
          </Card>
        );
  };
  
  export default ContractCard;
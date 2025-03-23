import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { AxiosContractsInstance } from '../network/API/AxiosInstance';
import { useParams } from 'react-router-dom';
import ContractCard from '../Components/ContractCard';
import HeaderColoredText from '../Components/HeaderColoredText';
function ClientContracts() {
    const prams=useParams();
  // Sample contract data (in a real application, this would come from an API)
  const [contracts, setContracts] = useState([]);
AxiosContractsInstance.get(`user/contracts/${prams.user_id}`)
    .then((response) => {
      setContracts(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  return (
    <Container className="py-4">
        <HeaderColoredText text="Your Contracts" />
      
      {contracts.length > 0 ? (
        contracts.map(contract => (
          <ContractCard key={contract.id} contract={contract} />
        ))
      ) : (
        <p>No contracts found.</p>
      )}
    </Container>
  );
}

export default ClientContracts;
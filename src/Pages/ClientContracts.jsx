import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { AxiosContractsInstance } from '../network/API/AxiosInstance';
import { useParams } from 'react-router-dom';
import ContractCard from '../Components/ContractCard';
import HeaderColoredText from '../Components/HeaderColoredText';
import { getFromLocalStorage } from '../network/local/LocalStorage';
function ClientContracts() {
    const prams=useParams();
  // Sample contract data (in a real application, this would come from an API)
  const [contracts, setContracts] = useState([]);
const current_user = getFromLocalStorage("auth");
  useEffect(() => {
    AxiosContractsInstance.get(`user/contracts/${prams.user_id}`,
      {
        headers: {
          'Authorization': `Bearer ${current_user.user.access}`
        }
      }
    )
      .then((response) => {
        setContracts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [prams.user_id]);
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
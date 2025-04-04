import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { AxiosContractsInstance } from '../network/API/AxiosInstance';
import { useParams } from 'react-router-dom';
import ContractCard from '../Components/ContractCard';
import HeaderColoredText from '../Components/HeaderColoredText';
import { getFromLocalStorage } from '../network/local/LocalStorage';

function ClientContracts() {
    const prams = useParams();
    const [contracts, setContracts] = useState([]);
    const current_user = getFromLocalStorage("auth");

    useEffect(() => {
        AxiosContractsInstance.get(`user/contracts/${current_user.user.user_id}`,
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
    }, [current_user.user.user_id]); // Changed from prams.user_id to current_user.user.user_id

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
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosContractsInstance } from '../network/API/AxiosInstance';
import { getFromLocalStorage } from '../network/local/LocalStorage';
import HeaderColoredText from './HeaderColoredText';
import PersonalImg from '../assets/default-user.png';
const ContractDetails = () => {
    const params = useParams();
    const contract_id = params.contract_id;
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const current_user = getFromLocalStorage("auth");

    useEffect(() => {
        AxiosContractsInstance.get(`get/${contract_id}`, {
            headers: {
                'Authorization': `Bearer ${current_user.user.access}`
            }
        })
            .then((response) => {
                setContract(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [contract_id]);
    

const handleAcceptOrDeclineContract = (e) => {
    setLoading(true); // Show loading state
    
    AxiosContractsInstance.patch(`update/${contract_id}`, 
        {
            contract_state: e.target.name === 'Accept' ? 'aproved' : 'canceled'
        },
        {    
            headers: {
                'Authorization': `Bearer ${current_user.user.access}`
            }
        }
    )
    .then(() => {
        console.log(`Contract ${e.target.name}ed successfully`);
        setContract((prevContract) => ({ ...prevContract, contract_state: e.target.name === 'Accept' ? 'aproved' : 'canceled' }));
        setLoading(false);

    })
    .catch((error) => {
        console.error("Error updating contract:", error);
        setError(error.message);
        setLoading(false);
    });
}

    if (loading) return <div className="d-flex justify-content-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger m-3" role="alert">{error}</div>;
    if (!contract) return <div className="alert alert-warning m-3" role="alert">Contract not found</div>;

    return (
        <div className="container my-4">
          <HeaderColoredText text="Contract Details" />
            <div className="card shadow ">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">{contract.project_details.project_name}</h3>
                    <span className={`badge ${contract.contract_state === 'aproved' ? 'bg-success' : 
                        contract.contract_state === 'pending' ? 'bg-warning' : 
                        contract.contract_state === 'finished' ? 'bg-info' :contract.contract_state === 'canceled'? 'danger': 'bg-secondary'}`}>
                        {contract.contract_state}
                    </span>
                </div>
                
                <div className="card-body">
                    <div className="mb-4">
                        <h4 className="card-title">Parties</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Client</h5>
                                        <div className="text-center mb-3">
                                            <img 
                                                src={contract.client_details.image ? contract.client_details.image : PersonalImg}
                                                alt={`${contract.client_details.first_name} ${contract.client_details.last_name}`}
                                                className="rounded-circle"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <p className="card-text mb-1"><strong>Name:</strong> {contract.client_details.first_name} {contract.client_details.last_name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Freelancer</h5>
                                        <div className="text-center mb-3">
                                     
                        <img 
                          src={contract.freelancer_details.image?contract.freelancer_details.image:PersonalImg} 
                          alt={`${contract.freelancer_details.first_name.charAt(0)} ${contract.freelancer_details.last_name.charAt(0)}`}
                          className="rounded-circle"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      
                                        </div>
                                        <p className="card-text mb-1"><strong>Name:</strong> {contract.freelancer_details.first_name} {contract.freelancer_details.last_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="card-title">Project Details</h4>
                        <p><strong>Project State:</strong> {contract.project_details.project_state}</p>
                        <p className="mb-1"><strong>Description:</strong> {contract.project_details.project_description}</p>
                    </div>

                    <div className="mb-4">
                        <h4 className="card-title">Contract Details</h4>
                         <p className="mb-1"><strong>Created At:</strong> {new Date(contract.created_at).toLocaleDateString()}</p>

                        <p className="mb-1"><strong>Budget:</strong> {contract.budget} $</p>
                        <p className="mb-1"><strong>Deadline:</strong> {contract.dedline} Days</p>
                    </div>

                    <div>
                        <h4 className="card-title">Terms and Conditions</h4>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text">{contract.contract_terms || 'No terms specified'}</p>
                            </div>
                        </div>
                    </div>

                    {contract.contract_state === 'pending' && current_user.user.role === "freelancer" && current_user.user.user_id === contract.freelancer_details.id && (
                        <div className="d-flex justify-content-end mt-4">
                            <button name='Accept' onClick={handleAcceptOrDeclineContract} className="btn btn-success me-2">Accept Contract</button>
                            <button name='Decline' onClick={handleAcceptOrDeclineContract} className="btn btn-danger">Decline Contract</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractDetails;
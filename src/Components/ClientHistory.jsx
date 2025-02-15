import axios from "axios";
import { Card, Image, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Rate_Stars from "./Rate_Stars";

function ClientHistory(props) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    rate: "",
    image: "",
  });
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total_pages: 1, // Initially 1 to prevent unnecessary empty state
  });

  const params = useParams();

  // Fetch client details
  useEffect(() => {
    if (props.owner_id) {
      axios
        .get(`https://api-generator.retool.com/Esur5x/dummyUsers/${props.owner_id}`)
        .then((res) => {
          setClientDetails(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [props.owner_id]);

  // Fetch proposals and calculate total pages
  useEffect(() => {
    if (!props.owner_id) return;

    axios
      .get(
        `https://api-generator.retool.com/ECRLlk/feedback?user_reviewed=${props.owner_id}&_page=${pageInfo.page}&_limit=10`,
        { observe: "response" }
      )
      .then((res) => {
        setProposals(res.data);

        // Extract total count from headers and calculate total pages
        const totalRecords = parseInt(res.headers["x-total-count"], 10) || 0;
        setPageInfo((prevState) => ({
          ...prevState,
          total_pages: Math.ceil(totalRecords / 10),
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, [pageInfo.page, props.owner_id]);

  const changeCurrentPage = (newPage) => {
    if (newPage >= 1 && newPage <= pageInfo.total_pages) {
      setPageInfo((prevState) => ({
        ...prevState,
        page: newPage,
      }));
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : proposals.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id} className="mb-3">
              <Card.Body>
                <Card.Title>
                  <div className="d-flex align-items-center">
                    <Image
                      src={proposal.img}
                      roundedCircle
                      alt={proposal.user_reviewr}
                      width={50}
                      height={50}
                      className="me-2"
                    />
                    <div className="d-flex flex-column">
                      <div>{clientDetails.name}</div>
                      <div className="text-muted">
                        <Rate_Stars rating={proposal.rate} />
                      </div>
                    </div>
                  </div>
                </Card.Title>
                <div className="fw-bold">Review Message:</div>
                <div>{proposal.message}</div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pageInfo.total_pages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => changeCurrentPage(pageInfo.page - 1)}
              disabled={pageInfo.page === 1}
            />
            {[...Array(pageInfo.total_pages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={pageInfo.page === i + 1}
                onClick={() => changeCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => changeCurrentPage(pageInfo.page + 1)}
              disabled={pageInfo.page === pageInfo.total_pages}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}

export default ClientHistory;

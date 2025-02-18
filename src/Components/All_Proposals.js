import axios from "axios";
import { Card, CardText, Image } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Rate_Stars from "./Rate_Stars";
import { Pagination } from "react-bootstrap";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";

function All_Proposals(props) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total_pages: 5,
  });
  //  location history match
  const params = useParams();
  useEffect(() => {
    AxiosProposalsInstance.get(`?_page=${pageInfo.page}&_limit=10`)
      .then((res) => {
        setProposals(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageInfo.page]);

  const changeCurrentPage = (newPage) => {
    if (newPage >= 1 && newPage <= pageInfo.total_pages) {
      setPageInfo((prevState) => ({
        ...prevState,
        page: newPage,
      }));
    }
  };

  const paginationItems = [];
  for (let i = 1; i <= pageInfo.total_pages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={pageInfo.page == i}
        onClick={() => changeCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      <div>
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                <div className="d-flex align-items-center">
                  <Image
                    src={proposal.user_image}
                    roundedCircle
                    alt={proposal.user_name}
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <div className="d-flex flex-column">
                    <div>{proposal.user_name}</div>
                    <div className="text-muted">
                      <Rate_Stars rating={proposal.user_rate} />
                    </div>
                  </div>
                </div>
              </Card.Title>

              <div className="mt-2">
                <span className="fw-bold">Deadline: </span>
                {proposal.deadline}
              </div>
              {/* </Card.Subtitle> */}
              {/* <Card.Text> */}
              <div className="fw-bold">Propose Message:</div>
              <div>{proposal.propose_text}</div>

              {/* </Card.Text> */}
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Prev
            onClick={() => changeCurrentPage(pageInfo.page - 1)}
            disabled={pageInfo.page === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => changeCurrentPage(pageInfo.page + 1)}
            disabled={pageInfo.page === pageInfo.total_pages}
          />
        </Pagination>
      </div>
    </>
  );
}
export default All_Proposals;

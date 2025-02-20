import { useState } from "react";
import { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";
import FreelancerProposalsCard from "./FreelancerProposalsCard";

function AllProposals(props) {
  const [proposals, setProposals] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total_pages: 5,
  });

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
        active={pageInfo.page === i}
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
          <FreelancerProposalsCard proposal={proposal} key={proposal.id} />
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
export default AllProposals;

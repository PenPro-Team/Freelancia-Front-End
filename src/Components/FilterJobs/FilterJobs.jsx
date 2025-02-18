import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function FilterJobs({ onSortRecent, isSortedByRecent }) {
  return (
    <>
      <ul className='list-unstyled list-inline'>
        {/* <li className='list-inline-item'>
          <Button variant="primary" style={{ marginBottom: "15px" }}>
            Top Clients
          </Button>
        </li> */}
        <li className='list-inline-item'>
          <Button variant="primary" onClick={onSortRecent} style={{ marginBottom: "15px" }}>
            {isSortedByRecent ? "Reset Order" : "Sort by Recent Jobs"}
          </Button>
        </li>
        <li className='list-inline-item'>
          <Button variant="primary" style={{ marginBottom: "15px" }}>
            Recommended Jobs
          </Button>
        </li>
      </ul>
      <hr />
    </>
  )
}

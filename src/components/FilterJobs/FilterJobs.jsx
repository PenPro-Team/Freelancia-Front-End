import React from 'react'
import { Link } from 'react-router-dom'

export default function FilterJobs() {
  return (
    <>
      <ul className='list-unstyled list-inline'>
        <li className='list-inline-item'>
          <Link
            className='btn btn-primary text-light text-decoration-none h6 p-1 rounded-3'
            to="#"
            aria-label="Recommended Jobs"
          >
            Recommended Jobs
          </Link>
        </li>
        <li className='list-inline-item'>
          <Link
            className='btn btn-primary text-light text-decoration-none h6 p-1 rounded-3'
            to="#"
            aria-label="Recent Jobs"
          >
            Recent Jobs
          </Link>
        </li>
        <li className='list-inline-item'>
          <Link
            className='btn btn-primary text-light text-decoration-none h6 p-1 rounded-3'
            to="#"
            aria-label="Top Rated Clients"
          >
            Top Rated Clients
          </Link>
        </li>
      </ul>
      <hr />
    </>
  )
}

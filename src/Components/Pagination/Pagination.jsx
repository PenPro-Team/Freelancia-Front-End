import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationButton({ currentPage, totalPages, onPageChange, count = 10 }) {
    let items = [];
    
    // Add Previous button
    items.push(
        <Pagination.Prev 
            key="prev"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        />
    );

    // Calculate total pages based on count
    const calculatedTotalPages = Math.ceil(count / 10);
    const displayedTotalPages = totalPages || calculatedTotalPages;
  
    for (let number = 1; number <= displayedTotalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => onPageChange(number)} 
            >
                {number}
            </Pagination.Item>
        );
    }

    // Add Next button
    items.push(
        <Pagination.Next 
            key="next"
            disabled={currentPage === displayedTotalPages}
            onClick={() => onPageChange(currentPage + 1)}
        />
    );
  
    return (
        <Pagination className="justify-content-center mt-3">
            {items}
        </Pagination>
    );
}

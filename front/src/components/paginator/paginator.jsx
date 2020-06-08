import React from 'react';
import ReactPaginate from 'react-paginate';
import './paginator.css';

function Paginator(props) {
  return (
    <ReactPaginate
      previousLabel="← Назад"
      nextLabel="Вперед →"
      breakLabel={<span className="gap">...</span>}
      pageCount={props.data.totalPages}
      onPageChange={props.handlePageClick}
      containerClassName="pagination"
      previousLinkClassName="previous-page"
      nextLinkClassName="next-page"
      disabledClassName="disabled"
      activeClassName="active"
    />
  );
}

export default Paginator;

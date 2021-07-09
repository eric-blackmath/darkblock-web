import React from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Pagination from '@material-ui/lab/Pagination';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

// export default function PaginationRounded() {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Pagination count={10} variant="outlined" shape="rounded" />
//     </div>
//   );
// }


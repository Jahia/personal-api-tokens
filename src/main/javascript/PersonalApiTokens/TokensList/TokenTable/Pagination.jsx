import React from 'react';
import {IconButton, Table, TableFooter, TablePagination, TableRow} from '@material-ui/core';
import {FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage} from '@material-ui/icons';
import PropTypes from 'prop-types';
import styles from './Pagination.scss';

const TablePaginationActions = ({count, page, rowsPerPage, onChangePage}) => (
    <div className={styles.paginationActions}>
        <IconButton
            disabled={page === 0}
            aria-label="First Page"
            data-jrm-role="table-pagination-button-first-page"
            onClick={event => onChangePage(event, 0)}
        >
            <FirstPage/>
        </IconButton>
        <IconButton
            disabled={page === 0}
            aria-label="Previous Page"
            onClick={event => onChangePage(event, page - 1)}
        >
            <KeyboardArrowLeft/>
        </IconButton>
        <IconButton
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
            data-jrm-role="table-pagination-button-next-page"
            onClick={event => onChangePage(event, page + 1)}
        >
            <KeyboardArrowRight/>
        </IconButton>
        <IconButton
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
            onClick={event => onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        >
            <LastPage/>
        </IconButton>
    </div>
);

TablePaginationActions.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};

export const Pagination = ({totalCount, pageSize, currentPage, onChangeRowsPerPage, labels, onChangePage}) => (
    <Table>
        <TableFooter>
            <TableRow>
                <TablePagination
                    count={totalCount}
                    rowsPerPage={pageSize}
                    page={currentPage}
                    ActionsComponent={TablePaginationActions}
                    labelRowsPerPage={labels.labelRowsPerPage}
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} ` + labels.of + ` ${count}`}
                    data-jrm-role="table-pagination"
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={event => onChangeRowsPerPage(event.target.value)}
                />
            </TableRow>
        </TableFooter>
    </Table>
);

Pagination.propTypes = {
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        labelRowsPerPage: PropTypes.string.isRequired,
        of: PropTypes.string.isRequired
    })
};


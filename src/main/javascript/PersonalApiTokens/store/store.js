import create from 'zustand';
import {CREATED_AT, DESCENDING_SORT, INITIAL_OFFSET, INITIAL_TOKEN_LIMIT} from '../constants';

const useStore = create(set => ({
    order: DESCENDING_SORT,
    orderBy: CREATED_AT,
    rowsPerPage: INITIAL_TOKEN_LIMIT,
    currentPage: INITIAL_OFFSET,

    setOrder: order => set(state => ({...state, order})),
    setOrderBy: orderBy => set(state => ({...state, orderBy})),
    setRowsPerPage: rowsPerPage =>
        set(state => ({...state, rowsPerPage})),
    setCurrentPage: currentPage => set(state => ({...state, currentPage}))
}));

export default useStore;

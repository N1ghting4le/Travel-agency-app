import { useState, useCallback, useRef } from "react";
import useQuery from "./query.hook";
import { getQueryParams } from "@/utils/getQueryParams";
import { initialPagination, DEFAULT_PAGE_SIZE } from "./constants";

export const usePagination = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pagination, setPagination] = useState(initialPagination);
  const paginatedQueryArgumentsRef = useRef(null);
  const initialQueryExecutedRef = useRef(false);

  const { query, ...rest } = useQuery();

  const performQuery = useCallback(
    async (url, queryParams, settings) => {
      try {
        const {
          content,
          pageable: { offset },
          totalElements,
          totalPages,
          last,
          numberOfElements,
        } = await query(`${url}?${queryParams}`, settings);

        setPagination({
          offset,
          totalElements,
          totalPages,
          last,
          numberOfElements,
        });

        return content;
      } catch (e) {
        setPagination(initialPagination);
        throw e;
      }
    },
    [query],
  );

  const initialQuery = useCallback(
    async (url, settings, additionalParams = {}) => {
      const queryParams = getQueryParams({
        ...additionalParams,
        page: 0,
        pageSize,
      });

      paginatedQueryArgumentsRef.current = [url, settings, additionalParams];
      initialQueryExecutedRef.current = false;
      setPage(0);
      setPagination(initialPagination);

      try {
        return await performQuery(url, queryParams, settings);
      } catch (e) {
        throw e;
      } finally {
        initialQueryExecutedRef.current = true;
      }
    },
    [pageSize, performQuery],
  );

  const paginatedQuery = useCallback(async () => {
    if (!paginatedQueryArgumentsRef.current) {
      return;
    }

    const [url, settings, additionalParams] =
      paginatedQueryArgumentsRef.current;
    const queryParams = getQueryParams({
      ...additionalParams,
      page,
      pageSize,
    });

    return await performQuery(url, queryParams, settings);
  }, [page, pageSize, performQuery]);

  const changePageSize = useCallback((pageSize, resetPage = true) => {
    setPageSize(pageSize);

    if (resetPage) {
      setPage(0);
    }
  }, []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize: changePageSize,
    pagination,
    initialQuery,
    isInitialQueryExecuted: initialQueryExecutedRef.current,
    paginatedQuery,
    queryState: rest,
    paginatedQueryArgumentsRef,
  };
};

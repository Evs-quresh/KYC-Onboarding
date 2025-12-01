import { useEffect, useMemo, useState } from 'react'

export function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1))
  }, [data.length, totalPages])

  const pageData = useMemo(() => {
    const start = page * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  return {
    page,
    totalPages,
    pageData,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, totalPages - 1)),
    prev: () => setPage((p) => Math.max(p - 1, 0)),
    pageSize,
  }
}


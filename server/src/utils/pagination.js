const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const pageSize = Math.min(parseInt(query.pageSize, 10) || 20, 100);
  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    limit: pageSize,
  };
};

const getPaginationMeta = (page, pageSize, total) => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = {
  getPagination,
  getPaginationMeta,
};

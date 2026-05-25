const { getPagination, getPaginationMeta } = require('../../../src/utils/pagination');

describe('Pagination Utils', () => {
  describe('getPagination', () => {
    it('应该返回默认分页参数', () => {
      const result = getPagination({});
      
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(20);
    });

    it('应该正确处理自定义分页参数', () => {
      const result = getPagination({ page: 3, pageSize: 10 });
      
      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(10);
      expect(result.offset).toBe(20);
      expect(result.limit).toBe(10);
    });

    it('应该限制最大 pageSize 为 100', () => {
      const result = getPagination({ page: 1, pageSize: 200 });
      
      expect(result.pageSize).toBe(100);
      expect(result.limit).toBe(100);
    });

    it('应该处理负数页码', () => {
      const result = getPagination({ page: -5, pageSize: 10 });
      
      expect(result.page).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getPaginationMeta', () => {
    it('应该正确计算总页数', () => {
      const result = getPaginationMeta(1, 20, 100);
      
      expect(result.totalPages).toBe(5);
    });

    it('应该正确判断 hasNext', () => {
      const firstPage = getPaginationMeta(1, 20, 100);
      const lastPage = getPaginationMeta(5, 20, 100);
      
      expect(firstPage.hasNext).toBe(true);
      expect(lastPage.hasNext).toBe(false);
    });

    it('应该正确判断 hasPrev', () => {
      const firstPage = getPaginationMeta(1, 20, 100);
      const secondPage = getPaginationMeta(2, 20, 100);
      
      expect(firstPage.hasPrev).toBe(false);
      expect(secondPage.hasPrev).toBe(true);
    });

    it('应该正确处理空数据', () => {
      const result = getPaginationMeta(1, 20, 0);
      
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });
});

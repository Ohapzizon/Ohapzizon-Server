import dataSource from '../../config/database/data-source';

export const isExistQuery = async (
  query: string,
  parameters: any[],
): Promise<boolean> => {
  const [{ exists }] = await dataSource.query(
    `SELECT EXISTS(${query}) AS "exists"`,
    parameters,
  );
  return exists === '1';
};

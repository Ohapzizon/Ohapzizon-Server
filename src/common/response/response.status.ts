export const ResponseStatus = {
  OK: 200,
  CREATED: 201,
  BAD_PARAMETER: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
} as const;

export type ResponseStatus = typeof ResponseStatus[keyof typeof ResponseStatus];

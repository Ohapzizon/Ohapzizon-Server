export const ResponseStatus = {
  OK: 200,
  CREATED: 201,
  BAD_PARAMETER: 400,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
} as const;

export type ResponseStatus = typeof ResponseStatus[keyof typeof ResponseStatus];

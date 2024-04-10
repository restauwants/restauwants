const pathnameHeader = "x-pathname";

export const getPathnameHeader = () => pathnameHeader;

export const newHeadersWithPathname = (headers: Headers, pathname: string) => {
  const newHeaders = new Headers(headers);
  newHeaders.set(pathnameHeader, pathname);
  return newHeaders;
};

export const getPathnameFromHeaders = (headers: Headers) => {
  return headers.get(pathnameHeader);
};

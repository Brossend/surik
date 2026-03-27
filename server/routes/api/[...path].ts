import { defineEventHandler, getRequestURL, proxyRequest } from 'h3';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const requestUrl = getRequestURL(event);
  const targetUrl = new URL(
    `${requestUrl.pathname}${requestUrl.search}`,
    config.apiProxyTarget,
  );

  return proxyRequest(event, targetUrl.toString());
});

export default {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/',
      headers: [{ key: 'Link', value: '<https://www.sewagecleanpros.com/llms.txt>; rel="describedby"; type="text/plain"' }],
    }];
  },
};

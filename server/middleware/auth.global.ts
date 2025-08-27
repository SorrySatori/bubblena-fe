export default defineEventHandler((event) => {
    const auth = getHeader(event, "authorization");
  
    const username = "kabypara";
    const password = "TajnyHeslo666";
    const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
  
    if (auth !== basicAuth) {
      setResponseStatus(event, 401);
      setHeader(event, "WWW-Authenticate", "Basic realm='Secure Area'");
      return "Authentication required";
    }
  });
  
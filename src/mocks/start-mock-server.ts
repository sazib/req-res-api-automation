import { createMockApiServer } from "./mock-server";

const host = process.env.MOCK_HOST || "0.0.0.0";
const port = Number(process.env.MOCK_PORT || 3001);

createMockApiServer().listen(port, host, () => {
  console.log(`Mock API server listening on http://${host}:${port}`);
});
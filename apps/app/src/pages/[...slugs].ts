import { api } from "@repo/api";

const handle = ({ request }: { request: Request }) => api.handle(request);

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;

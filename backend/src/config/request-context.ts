import { AsyncLocalStorage } from "async_hooks";

type RequestContext = {
  requestId?: string;
  creatorId?: string | null;
};

const als = new AsyncLocalStorage<RequestContext>();

export const runWithContext = (
  ctx: RequestContext,
  cb: (...args: any[]) => any,
) => als.run(ctx, cb as any);

export const getContext = (): RequestContext => als.getStore() ?? {};

export const setCreatorId = (creatorId: string) => {
  const store = als.getStore();
  if (store) store.creatorId = creatorId;
};

export default {
  runWithContext,
  getContext,
  setCreatorId,
};

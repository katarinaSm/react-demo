export const API_INVESTMENT = `/api/investment`;

// in general this next.js approach of exposing of env variables has a drawback:
// if a single artifact (bundle) is supposed to be used in different environments
// this approach won't work as env variable is defined on the build time instead of run-time
export const PROJECT_LIST_API_EP = process.env.NEXT_PUBLIC_PROJECT_LIST_API_EP;

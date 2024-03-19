// Resource: https://docs.uploadthing.com/nextjs/appdir#create-a-nextjs-api-route-using-the-filerouter


import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});
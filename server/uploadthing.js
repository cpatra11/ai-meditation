import e from "cors";
import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    audio: {
      /**
       * For full list of options and defaults and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
};
export { uploadRouter };

import { table } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table],
      },
    }
  }
});

// create a note
api.route("POST /notes", "packages/functions/src/create.main");

// get a note
api.route("GET /notes/{id}", "packages/functions/src/get.main");

// get all notes of the us
api.route("GET /notes", "packages/functions/src/list.main");
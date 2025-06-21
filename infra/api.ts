import { table, secret } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: true,
  transform: {
    route: {
      handler: {
        link: [table, secret],
      },
      args: {
        auth: { iam: true },
      },
    },
  },
});

// create a note
api.route("POST /notes", "packages/functions/src/create.main");

// get a note
api.route("GET /notes/{id}", "packages/functions/src/get.main");

// get all notes of the user
api.route("GET /notes", "packages/functions/src/list.main");

// update a note
api.route("PUT /notes/{id}", "packages/functions/src/update.main");

// delete a note
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

// star/unstar a note
api.route("PUT /notes/{id}/star", "packages/functions/src/star.main");

// create billing
api.route("POST /billing", "packages/functions/src/billing.main");

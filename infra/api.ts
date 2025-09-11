import { table } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: true,
  transform: {
    route: {
      handler: {
        link: [table],
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

// get all tags of the user
api.route("GET /tags", "packages/functions/src/tags.main");

// update a note
api.route("PUT /notes/{id}", "packages/functions/src/update.main");

// delete a note (soft delete)
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

// restore a deleted note
api.route("PUT /notes/{id}/restore", "packages/functions/src/restore.main");

// permanently delete a note from trash
api.route(
  "DELETE /notes/{id}/permanent",
  "packages/functions/src/permanent-delete.main"
);

// star/unstar a note
api.route("PUT /notes/{id}/star", "packages/functions/src/star.main");


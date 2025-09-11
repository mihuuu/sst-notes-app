// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB table
export const table = new sst.aws.Dynamo("Notes", {
  fields: {
    userId: "string",
    noteId: "string",
    createdAt: "number",
    updatedAt: "number",
  },
  primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
  globalIndexes: {
    "userId-createdAt-index": {
      hashKey: "userId",
      rangeKey: "createdAt",
    },
    "userId-updatedAt-index": {
      hashKey: "userId",
      rangeKey: "updatedAt",
    },
  },
});


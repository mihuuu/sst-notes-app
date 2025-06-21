import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const userId =
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;
  const noteId = event?.pathParameters?.id;

  const params = {
    TableName: Resource.Notes.name,
    Key: {
      userId: userId,
      noteId: noteId,
    },
  };

  await dynamoDb.send(new DeleteCommand(params));

  return JSON.stringify({ status: true });
});

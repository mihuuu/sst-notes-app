import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");
  const noteId = event.pathParameters?.id;

  if (!noteId) {
    throw new Error("Note ID is required");
  }

  const params = {
    TableName: Resource.Notes.name,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      noteId: noteId,
    },
    UpdateExpression:
      "set title = :title, content = :content, attachment = :attachment, tags = :tags, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":title": data.title,
      ":content": data.content,
      ":attachment": data.attachment,
      ":tags": data.tags || [],
      ":updatedAt": Date.now(),
    },
    ReturnValues: "ALL_NEW" as const,
  };

  const result = await dynamoDb.send(new UpdateCommand(params));

  return JSON.stringify(result.Attributes);
});

import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "(attribute_not_exists(deleted) OR deleted = :deleted)",
    ExpressionAttributeValues: {
      ":userId":
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      ":deleted": false,
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  // Extract all unique tags from notes
  const allTags = new Set<string>();

  if (result.Items) {
    result.Items.forEach((item) => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => {
          if (tag && tag.trim()) {
            allTags.add(tag.trim());
          }
        });
      }
    });
  }

  // Convert to array and sort alphabetically
  const tagsArray = Array.from(allTags).sort();

  return JSON.stringify(tagsArray);
});

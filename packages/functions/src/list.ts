import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const { starred, search } = event.queryStringParameters || {};

  const params: any = {
    TableName: Resource.Notes.name,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId":
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
    },
  };

  // Build filter expression for multiple conditions
  const filterConditions: string[] = [];

  // Add filter for starred notes if requested
  if (starred !== undefined) {
    const isStarred = starred === "true";
    filterConditions.push("starred = :starred");
    params.ExpressionAttributeValues[":starred"] = isStarred;
  }

  // Add search filter if requested (search in title and content)
  if (search && search.trim()) {
    filterConditions.push(
      "(contains(title, :search) OR contains(content, :search))"
    );
    params.ExpressionAttributeValues[":search"] = search.trim();
  }

  // Combine all filter conditions
  if (filterConditions.length > 0) {
    params.FilterExpression = filterConditions.join(" AND ");
  }

  const result = await dynamoDb.send(new QueryCommand(params));

  // Return the matching list of items in response body
  return JSON.stringify(result.Items);
});

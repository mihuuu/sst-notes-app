import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const { starred, keyword, deleted } = event.queryStringParameters || {};

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

  // Add filter for deleted notes
  if (deleted !== undefined) {
    const isDeleted = deleted === "true";
    filterConditions.push("deleted = :deleted");
    params.ExpressionAttributeValues[":deleted"] = isDeleted;
  } else {
    // By default, exclude deleted notes
    filterConditions.push(
      "(attribute_not_exists(deleted) OR deleted = :deleted)"
    );
    params.ExpressionAttributeValues[":deleted"] = false;
  }

  // Add filter for starred notes if requested
  if (starred !== undefined) {
    const isStarred = starred === "true";
    filterConditions.push("starred = :starred");
    params.ExpressionAttributeValues[":starred"] = isStarred;
  }

  // Add search filter if requested (search in title and content)
  if (keyword && keyword.trim()) {
    filterConditions.push(
      "(contains(title, :keyword) OR contains(content, :keyword))"
    );
    params.ExpressionAttributeValues[":keyword"] = keyword.trim();
  }

  // Combine all filter conditions
  if (filterConditions.length > 0) {
    params.FilterExpression = filterConditions.join(" AND ");
  }

  const result = await dynamoDb.send(new QueryCommand(params));

  // Return the matching list of items in response body
  return JSON.stringify(result.Items);
});

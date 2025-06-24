import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const { starred, keyword, deleted, sortBy, sortOrder, tag } =
    event.queryStringParameters || {};

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

  // Use GSI for sorting by createdAt if requested
  if (sortBy === "createdAt") {
    params.IndexName = "userId-createdAt-index";
    // DynamoDB sorts in ascending order by default, so we need to reverse for desc
    if (sortOrder === "desc") {
      params.ScanIndexForward = false;
    }
  } else if (sortBy === "updatedAt") {
    params.IndexName = "userId-updatedAt-index";
    // DynamoDB sorts in ascending order by default, so we need to reverse for desc
    if (sortOrder === "desc") {
      params.ScanIndexForward = false;
    }
  }

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

  // Add filter for tags if requested
  if (tag && tag.trim()) {
    filterConditions.push("contains(tags, :tag)");
    params.ExpressionAttributeValues[":tag"] = tag.trim();
  }

  // Combine all filter conditions
  if (filterConditions.length > 0) {
    params.FilterExpression = filterConditions.join(" AND ");
  }

  const result = await dynamoDb.send(new QueryCommand(params));

  return JSON.stringify({
    items: result.Items || [],
    total: result.Count || 0,
  });
});

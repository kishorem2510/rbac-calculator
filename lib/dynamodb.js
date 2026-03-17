import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function getRoleByName(roleName) {
  const command = new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      role_name: roleName,
    },
  });
  const response = await docClient.send(command);
  return response.Item;
}

export async function getAllRoles() {
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
  });
  const response = await docClient.send(command);
  return response.Items;
}
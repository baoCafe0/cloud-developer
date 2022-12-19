import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export class APIGatewayResult implements APIGatewayProxyResult {
  statusCode: number;
  headers?: { [header: string]: string | number | boolean; };
  multiValueHeaders?: { [header: string]: (string | number | boolean)[]; };
  body: string;
  isBase64Encoded?: boolean;

  constructor(dataBody: any) {
    this.statusCode = 200;
    this.headers = {
      "Access-Control-Allow-Origin": "*"
    };
    this.body = dataBody;
  }
}

export function getHeaderToken(event: APIGatewayProxyEvent) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1];
  return jwtToken;
}
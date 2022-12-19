import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getAllToDo } from '../../businessLogic/services'
import { APIGatewayResult, getHeaderToken } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const jwtToken = getHeaderToken(event);
  const todos = await getAllToDo(jwtToken);
  const body = JSON.stringify({
    "items": todos,
  });
  return new APIGatewayResult(body);
}
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
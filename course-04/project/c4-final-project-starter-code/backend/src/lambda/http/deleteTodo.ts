import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { APIGatewayResult, getHeaderToken } from '../utils'
import { deleteToDo } from '../../businessLogic/services'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const jwtToken = getHeaderToken(event);
    const deleteData = await deleteToDo(todoId, jwtToken);

    const body = deleteData;
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

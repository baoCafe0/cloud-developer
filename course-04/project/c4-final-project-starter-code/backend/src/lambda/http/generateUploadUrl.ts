import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { APIGatewayResult } from '../utils'
import { generateUploadUrl } from '../../businessLogic/services'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const link = await generateUploadUrl(todoId);

    const body = JSON.stringify({
      uploadUrl: link,
    })

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

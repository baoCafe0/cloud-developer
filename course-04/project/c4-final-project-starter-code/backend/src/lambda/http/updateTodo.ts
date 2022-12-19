import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { APIGatewayResult, getHeaderToken } from '../utils'
import { updateToDo } from '../../businessLogic/services'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const jwtToken = getHeaderToken(event);

    const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);
    const body = JSON.stringify({
      "item": toDoItem
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

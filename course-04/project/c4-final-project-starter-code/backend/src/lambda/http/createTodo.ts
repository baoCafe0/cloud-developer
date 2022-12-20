import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { APIGatewayResult, getHeaderToken } from '../utils';
import { createToDo } from '../../businessLogic/services'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const jwtToken = getHeaderToken(event);
    const todos = await createToDo(newTodo, jwtToken);

    const body = JSON.stringify({
      "item": todos,
    });

    return new APIGatewayResult(body);
  }
)

handler.use(
  cors({
    credentials: true
  })
)

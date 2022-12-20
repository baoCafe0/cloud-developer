import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { APIGatewayResult, getHeaderToken } from '../utils'
import { searchByKeyword } from '../../businessLogic/services'


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const keyword = event.queryStringParameters ? event.queryStringParameters.keyword : '';
        const jwtToken = getHeaderToken(event);

        const todos = await searchByKeyword(keyword, jwtToken);
        const body = JSON.stringify({
            "items": todos
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

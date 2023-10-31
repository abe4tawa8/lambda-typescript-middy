import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import secretsManager from '@middy/secrets-manager'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'

const logger = new Logger()

async function lambdaHandler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.error) {
    throw new Error('Who are you?')
  }
  const response = { message: 'Hello, world!', event, context }
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const handler = middy()
  .use(httpErrorHandler())
  .use(secretsManager({
    fetchData: {
      dbSecret: 'db'
    },
    setToContext: true
  }))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .handler(lambdaHandler)

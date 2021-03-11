//https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-gremlin-node-js.html
//https://docs.aws.amazon.com/neptune/latest/userguide/lambda-functions-examples.html

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {driver, process as gprocess, structure} from 'gremlin';
import * as async from 'async';
const Graph = structure.Graph;
const DriverRemoteConnection = driver.DriverRemoteConnection;


declare var process : {
    env: {
      NEPTUNE_ENDPOINT: string
    }
  }

  const database_url = 'wss://' + process.env.NEPTUNE_ENDPOINT + ':8182/gremlin';
  const graph = new Graph();
  const g = graph.traversal().withRemote(new DriverRemoteConnection(database_url, { traversalSource: 'g' }));

export async function handler(event: any, context: Context) {

   
console.log(event)
   
    
}



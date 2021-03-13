import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as neptune from "@aws-cdk/aws-neptune";
import * as appsync from "@aws-cdk/aws-appsync";

export class DiningAwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "diningByFriends",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, "Vpc", {
      subnetConfiguration: [
        {
          cidrMask: 24, // Creates a size /24 IPv4 subnet (a range of 256 private IP addresses) in the VPC
          name: "Ingress",
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    });

    // Create a security group and subnetgroup to ensure lambda and neptune cluster deploy on the same vpc
    const sg1 = new ec2.SecurityGroup(this, "mySecurityGroup1", {
      vpc,
      allowAllOutbound: true,
      description: "security group 1",
      securityGroupName: "mySecurityGroup",
    });
    cdk.Tags.of(sg1).add("Name", "mySecurityGroup");

    sg1.addIngressRule(sg1, ec2.Port.tcp(8182), "MyRule");

    const neptuneSubnet = new neptune.CfnDBSubnetGroup(
      this,
      "neptuneSubnetGroup",
      {
        dbSubnetGroupDescription: "My Subnet",
        subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED })
          .subnetIds,
        dbSubnetGroupName: "mysubnetgroup",
      }
    );
    // Creating neptune cluster
    const neptuneCluster = new neptune.CfnDBCluster(this, "MyCluster", {
      dbSubnetGroupName: neptuneSubnet.dbSubnetGroupName,
      dbClusterIdentifier: "myNep",
      vpcSecurityGroupIds: [sg1.securityGroupId],
    });
    neptuneCluster.addDependsOn(neptuneSubnet);

    // Creating neptune instance
    const neptuneInstance = new neptune.CfnDBInstance(this, "myinstance", {
      dbInstanceClass: "db.t3.medium",
      dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
      availabilityZone: vpc.availabilityZones[0],
    });
    neptuneInstance.addDependsOn(neptuneCluster);

    // add this code after the VPC code
    const handler = new lambda.Function(this, "Lambda", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: new lambda.AssetCode("functions/dining"),
      handler: "main.handler",
      vpc: vpc,
      securityGroups: [sg1],
      environment: {
        NEPTUNE_ENDPOINT: neptuneCluster.attrEndpoint,
      },
      vpcSubnets: {
        subnetType: ec2.SubnetType.ISOLATED,
      },
    });

    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasourceTodo", handler);

    // create resolvers to match GraphQL operations in schema

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "friends",
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "fiendsoffriends",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "userAssociated",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "specificCusineHighestRate",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "highestRatedCusine",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "latestReview",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "frindsRecommend",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "pastXDays",
    });



//mutations

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addPerson",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addReview",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addCusine",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addRestaurant",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addFriends",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addCity",
    });

    

    //https://github.com/aws-samples/aws-dbs-refarch-graph/tree/master/src/accessing-from-aws-lambda
    //We will review this link and update our code latter to put the lambda outside the VPC

    new cdk.CfnOutput(this, "Neptune Endpoint", {
      value: neptuneCluster.attrEndpoint,
    });
    // print out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // print out the AppSync API Key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // print out the stack region
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}

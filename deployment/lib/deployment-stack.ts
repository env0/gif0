import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const path = require("path");

const lambda = cdk.aws_lambda;

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../backend")),
      timeout: cdk.Duration.minutes(5),
    });

    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "TheUrl", {
      value: fnUrl.url,
    });
  }
}

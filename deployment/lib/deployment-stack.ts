import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const path = require("path");

const lambda = cdk.aws_lambda;

const envVars = [
  "GIPHY_API_KEY",
  "SLACK_APP_TOKEN",
  "SLACK_APP_SIGNING_SECRET",
];

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (envVars.some((key) => !process.env[key])) {
      throw new Error("Missing Env Variable");
    }

    const environment = envVars.reduce((prev, key) => {
      prev[key] = process.env[key] || "";
      return prev;
    }, {} as Record<string, string>);

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../backend")),
      timeout: cdk.Duration.minutes(5),
      environment,
    });

    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "TheUrl", {
      value: fnUrl.url + "slack/events",
    });
  }
}

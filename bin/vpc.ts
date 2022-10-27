#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc';

const app = new cdk.App();
const accountEnvironment: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
const vpcStack = new VpcStack(app, 'vpc', {
  env: accountEnvironment,
});

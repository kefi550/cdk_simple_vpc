import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export class VpcStack extends cdk.Stack {
  readonly vpc: ec2.Vpc;
  readonly internalSg: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, `${this.stackName}-vpc`, {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'isolated',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    this.internalSg = new ec2.SecurityGroup(this, `${this.stackName}-internal-sg`, {
      vpc: this.vpc,
      securityGroupName: 'kefi-vpc-internal',
      description: 'allow all trafic in kefi vpc internal',
    })
  }
}

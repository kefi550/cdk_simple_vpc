import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

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
    });

    this.internalSg = new ec2.SecurityGroup(this, `${this.stackName}-internal-sg`, {
      vpc: this.vpc,
      securityGroupName: 'kefi-vpc-internal',
      description: 'allow all trafic in kefi vpc internal',
    });
    this.internalSg.addIngressRule(
      this.internalSg,
      ec2.Port.allTraffic(),
    );

    new cdk.CfnOutput(this, 'OutputVpcId', {
      value: this.vpc.vpcId,
      exportName: `${this.stackName}::VpcId`,
    });
    new cdk.CfnOutput(this, 'OutputVpcBlock', {
      value: this.vpc.vpcCidrBlock,
      exportName: `${this.stackName}::VpcCidrBlock`,
    });
    new cdk.CfnOutput(this, 'OutputVpcAzs', {
      value: this.vpc.availabilityZones.join(','),
      exportName: `${this.stackName}::VpcAzs`,
    });
    new cdk.CfnOutput(this, 'OutputVpcPublicSubnetIds', {
      value: this.vpc.publicSubnets.map(subnet => subnet.subnetId).join(','),
      exportName: `${this.stackName}::VpcPublicSubnetIds`,
    });
    new cdk.CfnOutput(this, 'OutputVpcIsolatedSubnetIds', {
      value: this.vpc.isolatedSubnets.map(subnet => subnet.subnetId).join(','),
      exportName: `${this.stackName}::VpcIsolatedSubnetIds`,
    });
    new cdk.CfnOutput(this, 'OutputVpcInternalSg', {
      value: this.internalSg.securityGroupId,
      exportName: `${this.stackName}::VpcInternalSg`,
    });
  }
}

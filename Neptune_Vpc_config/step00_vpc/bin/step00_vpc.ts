#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Step00VpcStack } from '../lib/step00_vpc-stack';

const app = new cdk.App();
new Step00VpcStack(app, 'Step00VpcStack');

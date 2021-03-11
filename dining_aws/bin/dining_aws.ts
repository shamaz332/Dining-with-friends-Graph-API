#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DiningAwsStack } from '../lib/dining_aws-stack';

const app = new cdk.App();
new DiningAwsStack(app, 'DiningAwsStack');

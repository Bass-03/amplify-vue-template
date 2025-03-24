import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHelloFunctionHandler } from './functions/say-hello/resource';

const backend = defineBackend({
  auth,
  data,
  sayHelloFunctionHandler,
});

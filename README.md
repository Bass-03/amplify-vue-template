# Amplify Vue Todo Application with Python Lambda

This project is a Vue.js application powered by AWS Amplify that includes user authentication, a todo list feature, and a Python Lambda function integration. It demonstrates how to create a full-stack web application with AWS Amplify Gen 2.

## Features

- User authentication (sign in/sign out) via AWS Cognito
- Todo list CRUD operations with Amplify DataStore
- Vue Router for client-side navigation
- Python Lambda function integration
- Responsive design

## Prerequisites

- Node.js (v22.x or later)
- npm
- AWS account
- AWS Amplify CLI
- Python 3.13 (for local development of Lambda functions)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Bass-03/amplify-vue-template
cd amplify-vue-template
```

### 2. Install Dependencies

```bash
npm install
```

#### 2.1 Initialize Amplify

If you're starting from scratch:

```bash
npm install -g @aws-amplify/cli
amplify init
```

Follow the prompts to configure your Amplify project.

### 3. Deploy the Backend

```bash
amplify push
```

This will create all necessary resources in your AWS account including:
- Cognito User Pool for authentication
- DynamoDB table for todos
- AppSync GraphQL API
- Lambda functions

### 5. Run the Application Locally

Run these two at the same time

```bash
npm run dev
npm run sandbox
```

You want to see the output of those two commands, keep them in two different terminals.

Your application should now be running at http://localhost:5173

## Project Structure

```
amplify-vue-template/
├── amplify/                # Amplify backend configuration
│   ├── auth/               # Authentication configuration
│   ├── data/               # Data models and schema
│   ├── functions/          # Lambda functions
│   │   └── say-hello/      # Python Lambda example
├── src/                    # Vue application source code
│   ├── assets/             # Static assets
│   ├── components/         # Vue components
│   ├── App.vue             # Main application component
│   └── main.ts             # Application entry point
```

## Working with Python Lambda Functions

### Understanding the Existing Python Lambda

The example includes a "say-hello" Lambda function that:
1. Takes a name parameter
2. Returns a greeting message

Key files:
- `amplify/functions/say-hello/index.py`: Main Python handler
- `amplify/functions/say-hello/requirements.txt`: Python dependencies
- `amplify/functions/say-hello/resource.ts`: Lambda resource definition

### How to Add a New Python Lambda Function

1. **Create a new function**:

``` bash
touch amplify/functions/your-function-name/index.py
touch amplify/functions/your-function-name/resource.ts
touch amplify/functions/your-function-name/requirements.txt
```

2. **Implement Your Python Code**:

Edit the generated Python file at `amplify/functions/your-function-name/index.py`:

```python
import json

def handler(event, context):
    # Get parameters from the event
    args = event.get("arguments")
    if args:
        # Process input parameters
        param1 = args.get("param1")
    else:
        param1 = "default"

    # Your business logic here
    result = process_data(param1)

    # Return response
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Result: {result}"
        })
    }

def process_data(param):
    # Your custom logic
    return f"Processed {param}"
```

3. **Add Dependencies** (if needed):

Edit `amplify/functions/your-function-name/requirements.txt`:

```
requests==2.32.3
pandas==2.1.0
# Add other packages as needed
```

4. **Configure the Resource**:

Configure the function resource in `amplify/functions/your-function-name/resource.ts`:

```typescript
import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const yourFunctionHandler = defineFunction(
  (scope) =>
    new Function(scope, "your-function-name", {
      handler: "index.handler",
      runtime: Runtime.PYTHON_3_12,
      timeout: Duration.seconds(30), // Adjust as needed
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("lambda/python"),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `python3 -m pip install -r ${path.join(functionDir, "requirements.txt")} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    }),
    {
      resourceGroupName: "api" // Group this function with related resources
    }
);
```

5. **Add the Function to Your Backend**:

Update `amplify/backend.ts` to include your new function:

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHelloFunctionHandler } from './functions/say-hello/resource';
import { yourFunctionHandler } from './functions/your-function-name/resource';

const backend = defineBackend({
  auth,
  data,
  sayHelloFunctionHandler,
  yourFunctionHandler,
});
```

6. **Add the Function to Your Schema**:

Update `amplify/data/resource.ts` to expose your function via GraphQL:

```typescript
const schema = a.schema({
  // ... existing models

  yourFunction: a
    .query()
    .arguments({
      param1: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(yourFunctionHandler))
    .authorization(allow => [allow.authenticated()]), // This can also be public or other setting
});
```

8. **Call Your Function from Vue**:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
const result = ref<string>();

async function callFunction() {
  const { data, errors } = await client.queries.yourFunction({
    param1: "test-input"
  });

  if (data) {
    result.value = data;
  } else if (errors) {
    result.value = 'Error: ' + errors[0].message;
  }
}
</script>
```

## Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- [AWS Lambda Python Runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html)
- [Amplify UI Components](https://ui.docs.amplify.aws/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

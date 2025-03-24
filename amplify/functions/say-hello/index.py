import json

def handler(event, context):
    args = event.get("arguments")
    if args:
        # get name
        name = args.get("name")
    else:
        name = "World"
    body = {
      "message": f"Hello {name}, from a lambda function",
    }

    return {
        "statusCode": 200,
        "body": json.dumps(body)
    }

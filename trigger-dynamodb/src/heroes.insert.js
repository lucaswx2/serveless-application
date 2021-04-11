const uuid = require("uuid");
const Joi = require("@hapi/joi");
const decoratorValidator = require("./util/decoratorValidator");
class Handler {
  constructor({ dynamoDBSvc }) {
    this.dynamoDBSvc = dynamoDBSvc;
    this.dynamodbTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      nome: Joi.string().max(20).min(2).required(),
      poder: Joi.string().max(100).min(2).required(),
    });
  }

  async insertItem(params) {
    return this.dynamoDBSvc.put(params).promise();
  }
  prepareData(data) {
    const params = {
      TableName: this.dynamodbTable,
      Item: {
        ...data,
        id: uuid.v1(),
        createdAt: new Date().toISOString(),
      },
    };

    return params;
  }

  handlerSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };

    return response;
  }

  handlerError(data) {
    return {
      statusCode: data.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create item!!",
    };
  }
  async main(event) {
    try {
      const dbParams = this.prepareData(event.body);
      await this.insertItem(dbParams);
      return this.handlerSuccess(dbParams.Item);
    } catch (error) {
      console.error("Error thrown**", error.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}

const AWS = require("aws-sdk");
const { enumParams } = require("./util/GlobalEnum");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDBSvc: dynamoDB,
});
module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  enumParams.ARG_TYPE.BODY
);

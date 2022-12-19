import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { createLogger } from '../utils/logger'
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate";


const logger = createLogger('ToDoDTO')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoDTO {
    constructor(
        private readonly client: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {
        logger.info(`Get all todo list with USERID: ${userId}`)

        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.client.query(params).promise();
        const items = result.Items;

        return items as TodoItem[];
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        const params = {
            TableName: this.todoTable,
            Item: todoItem,
        };

        const result = await this.client.put(params).promise();
        console.log(result);
        return todoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #x = :x, #y = :y, #z = :z",
            ExpressionAttributeNames: {
                "#x": "name",
                "#y": "dueDate",
                "#z": "done"
            },
            ExpressionAttributeValues: {
                ":x": todoUpdate['name'],
                ":y": todoUpdate['dueDate'],
                ":z": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.client.update(params).promise();
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const result = await this.client.delete(params).promise();
        console.log(result);
        return "";
    }

    async generateUploadUrl(todoId: string): Promise<string> {

        const url: string = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });

        return url;
    }
}


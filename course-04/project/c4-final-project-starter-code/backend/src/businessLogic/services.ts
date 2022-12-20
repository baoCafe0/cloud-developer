import { parseUserId } from "../auth/utils";
import { ToDoDTO } from "../dataAccess/ToDoDTO";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const uuidv4 = require('uuid/v4');
const toDoDTO = new ToDoDTO();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoDTO.getAllToDo(userId);
}

export async function searchByKeyword(keyword: string, jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoDTO.searchByKeyword(userId, keyword);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId = uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;

    return toDoDTO.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoDTO.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoDTO.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return toDoDTO.generateUploadUrl(todoId);
}
import { AppError } from "./app-errors.js";

const errorMap = {
    'NOT_FOUND' : {
        'code': 404,
        'message': 'resource not found in the db'
    },
    'FST_JWT_NO_AUTHORIZATION_IN_COOKIE':{
        'code': 401,
        'message': 'Unauthorized: Invalid or expired token'
    },
    'FST_JWT_AUTHORIZATION_TOKEN_INVALID':{
        'code': 401,
        'message': 'Unauthorized: Invalid or expired token'
    },
     'PHOTO_POSITION_TAKEN': {
        'code': 409,
        'message': 'The position specified for this photo is already taken.'
     },
     'DUPLICATE_RECORD': {
        'code': 409,
        'message': 'A record with this information already exists.'
     },
     'FORBIDDEN': {
        'code': 403,
        "message": 'You do not have permission to modify this resource.'
     },
     'TRANSACTIONS':{
        'code': 401,
        "message": "Unauthorized: listing has pending transactions",
     },
     'BAD_REQUEST': {
        'code': 400,
        'message': 'Seller and buyer cannot be the same'
         
    },
    'FST_ERR_VALIDATION':
    {
        'code': 400,
        'message': 'Validation failed: the data provided is incorrect.'
    },
    'INTERNAL_SERVER_ERROR': {
        'code': 500,
        'message':'An unexpected error occurred on the server.'
    }
};


export async function errorHandler(error, request, reply) {
    
    console.error(error);
    const config = errorMap[error.code] || errorMap.INTERNAL_SERVER_ERROR;
    let finalMessage = (error instanceof AppError) ? (error.message || config.message): config.message;
    if(error.validation)
    {
        const detail = error.validation[0];
        finalMessage = `Validation error: ${detail.instancePath} ${detail.message}`;  
    }

    return reply.code(config.code).send({
        "status": "error",
        "message": finalMessage,
        "code": config.code
    });
}
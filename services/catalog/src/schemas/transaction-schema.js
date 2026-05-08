const errorResponseSchema = {
    type: 'object',
    required: ['status', 'message', 'code'],
    properties: {
        status : {type : 'string', const : 'error'},
        message: {type: 'string'},
        code: {type: 'integer'}
    }
};


const createTransactionSchema = {
    schema: {
        body:{
            type : 'object',
            required: ['listingId', 'sellerId', 'buyerId', 'price'],
            properties: {
                listingId : {type: 'string' , format: 'uuid'},
                sellerId: {type: 'string' , format: 'uuid'},
                buyerId: {type: 'string' , format: 'uuid'},
                price: {type: 'number' , minimum : 0}
            }
        },
        response: {
            200: {
                type: 'object',
                requerid: ['status', 'data', 'message'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    message: {type: 'string'},
                    data: {
                        type: 'object',
                        properties: {
                            listing: {type: 'string' , format: 'uuid'},
                            user: {type: 'string' , format: 'uuid'}
                        }
                    }
                }
            },
            500: errorResponseSchema,
            409: errorResponseSchema,
            404: errorResponseSchema,
            401: errorResponseSchema,

        }
    }
};

export { createTransactionSchema };
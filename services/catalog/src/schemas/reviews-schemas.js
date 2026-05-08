const errorResponseSchema = {
    type: 'object',
    required: ['status', 'message', 'code'],
    properties: {
        status : {type : 'string', const : 'error'},
        message: {type: 'string'},
        code: {type: 'integer'}
    }
};


const createReviewsSchema = {
    schema : {
        body: {
            type: 'object',
            required :['listingId', 'stars', 'review'],
            properties: {
                listingId : {type: 'string' , format: 'uuid'},
                stars: {type: 'integer', minimum: 1, maximum: 5},
                review: {type: 'string', maxLength: 700}
            }
        }
        ,
        respose: {
            200: {
                type: 'object',
                requerid: ['status', 'data', 'message'],
                properties:{
                    status: {type: 'string', const: 'success'},
                    message: {type: 'string'},
                    data: {
                        type: 'object',
                        properties: {
                            listingId: {type: 'string' , format: 'uuid'},
                            title: {type: 'string'},
                            buyerId: {type: 'string' , format: 'uuid'},
                            stars: {type: 'integer'},
                            review: {type: 'string'},
                            createdAt: { type: 'string', format: 'date-time' }                        
                        }
                    }
                }
            },
            400: errorResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
            500: errorResponseSchema
        }
    }
};

const getReviewsByUser = {
    schema : {
        params: {
            type: 'object',
            required: ['userId'],
            properties: {
                userId : {type: 'string' , format: 'uuid'}
            }
        },
        response: {
            200:{
                type: 'object',
                required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                listingId: { type: 'string', format: 'uuid' },
                                title: { type: 'string' },
                                categoryName: { type: 'string' },
                                buyerId: { type: 'string', format: 'uuid' },
                                stars: {type: 'integer'},
                                review: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                                path: {type: 'string'}
                            }
                        }
                    }
                }
                
            },500: errorResponseSchema

        }

    }
};

const getgetReviewStatsByUserSchema = {
    schema: {
      params: {
            type: 'object',
            required: ['userId'],
            properties: {
                userId : {type: 'string' , format: 'uuid'}
            }
        },
        response: {
            200: {
                type: 'object',
                 required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data: {
                        type: 'object',
                        properties: {
                            user_id: { type: 'string', format: 'uuid' },
                            totalReviews: {type: 'integer'},
                            reviewAvg: { type: 'number' },
                        }
                    }
                }   
            }
        },
        500: errorResponseSchema
    }
};

export { createReviewsSchema, getReviewsByUser, getgetReviewStatsByUserSchema };
const errorResponseSchema = {
    type: 'object',
    required: ['status', 'message', 'code'],
    properties: {
        status : {type : 'string', const : 'error'},
        message: {type: 'string'},
        code: {type: 'integer'}
    }
};

const objetListingSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        state: { type: 'string' },
        price: {type : 'number'},
        createdAt: { type: 'string', format: 'date-time' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        categoryId: { type: 'integer' },
        categoryName: { type: 'string' }, 
        photos: {
            type: 'array',
            nullable: true,
            items: {
                type: 'object',
                properties: {
                    photoId: { type: 'integer' },
                    path: { type: 'string' },
                    position: { type: 'integer' }
                }
            }
        }
    }   
};


const addToWishListSchema = {
    schema: {
        body:{
            type: 'object',
            required: ['listingId'],
            properties: {
                listingId : {type: 'string' , format: 'uuid'}
            }
        } 
        ,
        response: {
            200:{
                type: 'object',
                required: ['status', 'data', 'message' ],
                properties: {
                    status: {type: 'string', const: 'success'},
                    message:{type: 'string'},
                    data: {
                        type: 'object',
                        properties: {
                            listingId: { type: 'string', format: 'uuid' },
                            userId: {type: 'string', format: 'uuid' },
                            createdAt: { type: 'string', format: 'date-time' },
                        }
                    }
                }
            },
            400: errorResponseSchema,
            401: errorResponseSchema,
            404: errorResponseSchema,
            500: errorResponseSchema
        }
    }
};

const removeFromWishlistSchema = {
    schema : {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id : {type: 'string' , format: 'uuid'}            
            }
        },
        response:{
            200: {
                type: 'object',
                required: ['status', 'data', 'message' ],
                properties: {
                    status: {type: 'string', const: 'success'},
                    message:{type: 'string'},
                    data: {
                        type: 'object',
                        properties: {
                            listingId: { type: 'string', format: 'uuid' },
                            userId: {type: 'string', format: 'uuid' },
                            createdAt: { type: 'string', format: 'date-time' },
                        }
                    }
                }
            }
        },
        400: errorResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
    }
};

const getWishlistSchema = {
    schema: {
        querystring: {
            type: 'object',
            additionalProperties: false
        },
        response: {
            200:{
                type: 'object',
                required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data:{
                        type: 'array',
                        items: objetListingSchema
                    }
                }
            },
            401: errorResponseSchema,
            500: errorResponseSchema
        }
    }
};

const getWishlistCountSchema =  {
    schema:{
        params: {
            type: 'object',
            required: ['idListing'],
            properties: {
                idListing : {type: 'string' , format: 'uuid'}            
            }
        },
        response:{
            200:{
               type: 'object',
               required: ['status','data'],
               properties: {
                   status: {type: 'string', const: 'success'},
                   data: {
                        type: 'object',
                        properties: {
                            listingId: {type: 'string' , format: 'uuid'},
                            TotalWishlistCount: {type: 'integer'},
                        }
                   }
               }
            },
            401: errorResponseSchema,
            500: errorResponseSchema
        }
    }
};
export {addToWishListSchema, removeFromWishlistSchema, getWishlistSchema, getWishlistCountSchema};
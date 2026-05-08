const errorResponseSchema = {
    type: 'object',
    required: ['status', 'message', 'code'],
    properties: {
        status : {type : 'string', const : 'error'},
        message: {type: 'string'},
        code: {type: 'integer'}
    }
};

const mutationSuccessSchema = {
    type: 'object',
    required: ['status', 'data', 'message'],
    properties:{
        status: {type: 'string', const: 'success'},
        message: {type: 'string'},
        data: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                user_id: {type: 'string', format: 'uuid' },
                title: { type: 'string' },
                price: {type: 'number'},
                state: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                idCategory: { type: 'integer' },
                photos: {
                    type: 'array',
                    items:{
                        type: 'object',
                        properties: {
                            path: { type: 'string' },
                            position: { type: 'integer' }
                        }
                    }

                }
            }                    
        }
    }                   
};

const objetListingSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        userId: {type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        state: { type: 'string' },
        price: {type : 'number'},
        createdAt: { type: 'string', format: 'date-time' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        categoryId: { type: 'integer' },
        categoryName: { type: 'string' },
        wishlist: {type: 'string'},
        reviewAvg: {type: 'number'},
        review: {
            type: 'object',
            properties: {
                buyerId: {type: 'string', format: 'uuid' },
                stars: { type: 'integer' },
                review: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }   
            }
        },
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

const objetListingTransactionsSchema = {
    type: 'object',
    properties: {
        listingId: { type: 'string', format: 'uuid' },
        buyerId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        listinPrice: {type : 'number'},
        transactionPrice: {type : 'number'},
        listingDate: { type: 'string', format: 'date-time' },
        transactionDate:{ type: 'string', format: 'date-time' },
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

const getListingsByUserSchema = {
    schema: {
        params:{
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
                data:{
                    type: 'array',
                    items: objetListingSchema
                }
            }
        },
        500: errorResponseSchema
        }
    }
};

const getOwnListingsSchema = {
    schema:{
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
            500: errorResponseSchema
        }        
    }
};

const getOwnListingsSoldSchema = {
        schema: {
        querystring: {
            type: 'object',
            additionalProperties: false
        },
        response: {
            200: {
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
                                sellerId: { type: 'string', format: 'uuid' },
                                title: { type: 'string' },
                                listinPrice: {type : 'number'},
                                transactionPrice: {type : 'number'},
                                listingDate: { type: 'string', format: 'date-time' },
                                transactionDate:{ type: 'string', format: 'date-time' },
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
                        }
                    }
                }
            },
            500: errorResponseSchema,
            401: errorResponseSchema
        }   
    }
};

const getOwnListingsBoughtSchema = {
    schema: {
        querystring: {
            type: 'object',
            additionalProperties: false
        },
        response: {
            200: {
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
                                buyerId: { type: 'string', format: 'uuid' },
                                title: { type: 'string' },
                                listinPrice: {type : 'number'},
                                transactionPrice: {type : 'number'},
                                listingDate: { type: 'string', format: 'date-time' },
                                transactionDate:{ type: 'string', format: 'date-time' },
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
                        }
                    }
                }
            },
            500: errorResponseSchema,
            401: errorResponseSchema
        }
        
    }
};

const getListingDetailSchema = {
    schema:{
        params:{
            type: 'object',
            required: ['id'],
            properties: {
                id : {type: 'string' , format: 'uuid'}
            }
        },
        response: {
            200:{
                type: 'object',
                required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data:objetListingSchema
                }
            },
            500:errorResponseSchema,
            401: errorResponseSchema      
        }
    }   
};

const createListingSchema = {
    schema:{
        body:{
            type: 'object',
            required: ['title', 'description','price', 'longitude', 'latitude', 'idCategory', 'photos'],
            properties:{
                title: {type: 'string', minLength: 5, maxLength: 200},
                description : {type: 'string', maxLength: 700},
                price: {type: 'number', minimum: 0},
                idCategory: {type: 'integer' , minimum: 1 , maximum: 376},
                latitude: {type: 'number'},
                longitude: {type: 'number'},
                photos: {
                    type: 'array',
                    nullable: false,
                    items: {
                        type: 'object',
                        properties: {
                            path: {type: 'string'},
                            position: {type: 'integer', minimum: 0}
                        }
                    }
                }
                
            }
        }
        ,
        response: {
            200: mutationSuccessSchema,
            500: errorResponseSchema,
            409: errorResponseSchema,
            404: errorResponseSchema,
            401: errorResponseSchema,                
        }
    }
};

const updateListingSchema = createListingSchema;

const deleteListingSchema = {
    schema: {
        params:{
            type: 'object',
            required: ['id'],
            properties: {
                id : {type: 'string' , format: 'uuid'}
            }
        },
        response: {
            200 : mutationSuccessSchema,
            404 : errorResponseSchema,
            401 : errorResponseSchema,
            403 : errorResponseSchema,
            409: errorResponseSchema,
            500 : errorResponseSchema
        }

    }
};

const randomLisitingSchema = {
    schema: {
        response: {
            200:{
                type: 'object',
                required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data:objetListingSchema
                }
            },
            500: errorResponseSchema
        }
    }
};

const searchListingSchema = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                categoryId: {type: 'integer', minimum: 0},
                minPrice: {type: 'number' , minimum: 0},
                maxPrice: {type: 'number' , minimum: 0},
                timeFilter: {
                    type: 'string' ,
                    enum: ['today', 'lastWeek','lastMonth']
                },
                keywords: {type: 'string'},
                radius: {type: 'integer', minimum: 1},
                lat: {type: 'number', minimum:-90, maximum: 90},
                lng: {type: 'number', minimum: -180, maximum: 180},
                orderBy: {
                    type: 'string',
                    enum: ['price_low_to_high','price_high_to_low', 'newest','closest']
                },
                page: {type: 'integer', minimum: 0}
            },
            dependencies: {
                lat: ['lng'],
                lng: ['lat']
            }
        },
        response:{
            200:{
                type: 'object',
                required: ['status', 'data'],
                properties: {
                    status: {type: 'string', const: 'success'},
                    data:{
                        type: 'object',
                        required: ['listings', 'total_items'],
                        properties: {
                            listings: {
                                type: 'array',
                                items: objetListingSchema
                            },
                            total_items :{type: 'array'}
                        }
                    }
                }
            },
            500: errorResponseSchema
        }
    }
};

const reserveListingSchema = {
    schema: {
        params:{
            type: 'object',
            required: ['id'],
            properties: {
                id : {type: 'string' , format: 'uuid'}
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: {type: 'string', const: 'success'},
                    message: {type: 'string'},
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            user_id: {type: 'string', format: 'uuid' },
                            state: { type: 'string' },
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

export {getOwnListingsSchema, getListingDetailSchema, createListingSchema, updateListingSchema, deleteListingSchema, randomLisitingSchema,
        searchListingSchema, reserveListingSchema, getOwnListingsSoldSchema, getOwnListingsBoughtSchema, getListingsByUserSchema};

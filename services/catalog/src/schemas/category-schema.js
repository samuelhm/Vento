const getCategoriesSchema = {
    schema :{
        response: {
            200:{
                type: 'object',
                required: ['status','data'],
                properties: {
                    status: {type: 'string'},
                    data: {
                        type: 'array', 
                        items:{
                            type : 'object', 
                            required: ['id', 'name', 'count'],
                            properties: {
                                id: { type: 'integer'},
                                name: { type: 'string'},        
                                count:{ type: 'integer'}
                            }
                        } 
                    }
                }
            },
            500:{
                type: 'object',
                requeried: ['status', 'message', 'code'],
                properties : {
                    status : {type : 'string'},
                    message: {type: 'string'},
                    code: {type: 'integer'}
                }
            }
        }
    }
};

const categoryNodeSchema = {
    $id: 'categoryNode',
    type: 'object',
    required: ['id', 'name', 'subcategories', 'count', 'path'],
    properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        count: {type: 'integer'},
        path: {type: 'string'},
        subcategories:{
            type: 'array',
            items: {$ref: 'categoryNode#'}
        }
    }
};


const getCategoryTreeSchema = {
    schema:{
        response:{
            200:{
                type: 'object',
                requeried: ['status', 'data'],
                properties: {
                    status: {type: 'string'},
                    data: {
                        type: 'array',
                        items: {$ref: 'categoryNode#'}
                    }
                }
            },               
            500:{
                type: 'object',
                required: ['status', 'mesagge','code'],
                properties: {
                    status: {type: 'string'},
                    mesagge: {type: 'string'},
                    code: {type: 'integer'}
                }
            }
        }
    }
};

export {getCategoriesSchema, categoryNodeSchema, getCategoryTreeSchema};
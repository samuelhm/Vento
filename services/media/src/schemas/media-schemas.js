// Media schemas for request/response validation

export const getImageSchema = {
  params: {
    type: 'object',
    properties: {
      filename: { type: 'string' }
    },
    required: ['filename']
  }
};

export const uploadSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'integer' }
      }
    },
    413: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'integer' }
      }
    }
  }
};

export const deleteImageSchema = {
  params: {
    type: 'object',
    properties: {
      filename: { type: 'string' }
    },
    required: ['filename']
  },
  headers: {
    type: 'object',
    properties: {
      'x-service-secret': { type: 'string' }
    },
    required: ['x-service-secret']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            deleted: { type: 'string' }
          }
        }
      }
    },
    403: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'integer' }
      }
    },
    404: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'integer' }
      }
    }
  }
};

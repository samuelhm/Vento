export const signupSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'name', 'lastNames', 'lat', 'lng'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      name: { type: 'string', minLength: 2 },
      lastNames: { type: 'string', minLength: 2 },
      avatarUrl: { type: ['string', 'null'], pattern: '^img_[a-f0-9-]+\\.webp$' },
      lat: { type: 'number', minimum: -90, maximum: 90 },
      lng: { type: 'number', minimum: -180, maximum: 180 }
    },
    additionalProperties: false
  }
};

export const signinSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    additionalProperties: false
  }
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
    lastNames: { type: 'string' },
    avatarUrl: { type: 'string', nullable: true },
    coordinates: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      }
    }
  }
};

export const meResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success'] },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        lastNames: { type: 'string' },
        avatarUrl: { type: 'string', nullable: true },
        coordinates: {
          type: 'object',
          properties: {
            lat: { type: 'number' },
            lng: { type: 'number' }
          }
        }
      }
    }
  }
};

export const userIdParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id']
};

export const updateUserSchema = {
  params: userIdParamSchema,
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2 },
      lastNames: { type: 'string', minLength: 2 },
      lat: { type: 'number' },
      lng: { type: 'number' },
      avatarUrl: { type: 'string', pattern: '^img_[a-f0-9-]+\\.webp$' }
    },
    additionalProperties: false
  }
};

export const deleteUserSchema = {
  params: userIdParamSchema
};

export const forgotPasswordSchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' }
    },
    additionalProperties: false
  }
};

export const forgotPasswordResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  }
};

export const resetPasswordSchema = {
  body: {
    type: 'object',
    required: ['token', 'newPassword'],
    properties: {
      token: { type: 'string' },
      newPassword: { type: 'string', minLength: 8 }
    },
    additionalProperties: false
  }
};

export const resetPasswordResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  }
};

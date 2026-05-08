// Media controller - Business logic for image handling

import path from 'path';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const SERVICE_SECRET = process.env.SERVICE_SECRET;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isValidFileType(mimetype) {
  return ALLOWED_MIME_TYPES.includes(mimetype);
}

async function healthCheck(request, reply) {
  return { 
    status: 'success',
    data: {
      service: process.env.SERVICE_NAME || 'Media Service',
      uploadDir: UPLOAD_DIR,
      allowedFormats: ALLOWED_MIME_TYPES,
      maxSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  };
}

async function getImage(request, reply) {
  try {
    const { filename } = request.params;
    
    return reply
      .type('image/webp')
      .sendFile(filename, UPLOAD_DIR);
      
  } catch (error) {
    request.log.error(error);
    
    if (error.code === 'ENOENT') {
      return reply.code(404).send({
        status: 'error',
        message: 'Image not found',
        code: 404
      });
    }
    
    return reply.code(500).send({
      status: 'error',
      message: 'Internal server error',
      code: 500
    });
  }
}

async function uploadImages(request, reply) {
  try {
    const uploadedFiles = [];
    const customNames = [];
    
    const parts = await request.parts();
    
    for await (const part of parts) {
      // Capture custom filenames sent by frontend
      if (part.type === 'field' && part.fieldname === 'names') {
        customNames.push(part.value);
      }
      // Process image files
      else if (part.type === 'file') {
        
        if (!isValidFileType(part.mimetype)) {
          return reply.code(400).send({
            status: 'error',
            message: `Invalid file format: ${part.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
            code: 400
          });
        }
        
        // Use custom name from frontend if provided, otherwise use original filename
        const filename = customNames[uploadedFiles.length] || part.filename;
        const filepath = path.join(UPLOAD_DIR, filename);
        const buffer = await part.toBuffer();
        
        // Convert to WebP with 80% quality (optimal balance)
        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(filepath);
        
        uploadedFiles.push(filename);
      }
    }
    
    // At least one image required per product
    if (uploadedFiles.length === 0) {
      return reply.code(400).send({
        status: 'error',
        message: 'No files uploaded',
        code: 400
      });
    }
    
    return {
      status: 'success',
      data: {
        files: uploadedFiles
      }
    };

  } catch (error) {
    request.log.error(error);
    
    if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.code(413).send({
        status: 'error',
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        code: 413
      });
    }
    
    return reply.code(500).send({
      status: 'error',
      message: 'Internal server error',
      code: 500
    });
  }
}

async function deleteImage(request, reply) {
  try {
    // Validate internal service authentication
    const serviceSecret = request.headers['x-service-secret'];
    
    if (!serviceSecret || serviceSecret !== SERVICE_SECRET) {
      return reply.code(403).send({
        status: 'error',
        message: 'Forbidden: Invalid service credentials',
        code: 403
      });
    }
    
    const { filename } = request.params;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    await unlink(filepath);
    
    return {
      status: 'success',
      data: {
        deleted: filename
      }
    };
    
  } catch (error) {
    request.log.error(error);
    
    if (error.code === 'ENOENT') {
      return reply.code(404).send({
        status: 'error',
        message: 'Image not found',
        code: 404
      });
    }
    
    return reply.code(500).send({
      status: 'error',
      message: 'Internal server error',
      code: 500
    });
  }
}

export default {
  healthCheck,
  getImage,
  uploadImages,
  deleteImage
};

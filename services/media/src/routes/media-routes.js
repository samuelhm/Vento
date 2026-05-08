// Media routes configuration

import mediaController from '../controllers/media-controller.js';
import { uploadSchema, getImageSchema, deleteImageSchema } from '../schemas/media-schemas.js';

async function mediaRoutes(fastify) {
  
  // Health check
  fastify.get('/', mediaController.healthCheck);
  
  // Get image by filename
  fastify.get('/:filename', {
    schema: getImageSchema
  }, mediaController.getImage);
  
  // Upload images
  fastify.post('/upload', {
    schema: uploadSchema
  }, mediaController.uploadImages);
  
  // Delete image (internal service only)
  fastify.delete('/:filename', {
    schema: deleteImageSchema
  }, mediaController.deleteImage);
}

export default mediaRoutes;

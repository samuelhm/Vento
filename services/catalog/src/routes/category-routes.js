import categories from '../controllers/category-controllers.js';
import * as categorySchema from '../schemas/category-schema.js';

export default async function categoryRoutes(fastify, options) {
    fastify.get('/categories', categorySchema.getCategoriesSchema, categories.getAllCategories);
    fastify.get('/categories/tree',categorySchema.getCategoryTreeSchema,categories.getCategoryTree);
}

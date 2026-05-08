import reviews from '../controllers/reviews-controllers.js';
import * as reviewsSchemas from '../schemas/reviews-schemas.js';

async function reviewsRoutes(fastify, options) {
    fastify.get('/reviews/:userId', reviewsSchemas.getReviewsByUser , reviews.getReviewsByUser);
    fastify.get('/reviews/user/:userId/stats', reviewsSchemas.getgetReviewStatsByUserSchema, reviews.getReviewStatsByUser);
    fastify.post('/reviews', reviewsSchemas.createReviewsSchema, reviews.createReviews);
}

export default reviewsRoutes;
import wishlist from '../controllers/wishlist-controllers.js';
import * as whislistSchema from '../schemas/wishlist-schema.js';

async function wishlistRoutes(fastify, options) {
    
    fastify.get('/wishlist', whislistSchema.getWishlistSchema , wishlist.getWishlist);
    fastify.get('/wishlist/count/:idListing',whislistSchema.getWishlistCountSchema ,wishlist.getWishlistCount);
    fastify.post('/wishlist', whislistSchema.addToWishListSchema, wishlist.addToWishList);
    fastify.delete('/wishlist/:id', whislistSchema.removeFromWishlistSchema,  wishlist.removeFromWishlist);
}

export default wishlistRoutes;
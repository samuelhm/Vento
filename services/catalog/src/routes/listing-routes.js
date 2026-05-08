import listings from '../controllers/listing-controllers.js';
import * as listingSchema from '../schemas/listing-schema.js';

async function listingRoutes(fastify, options){
    
    fastify.get('/listings/mine/sold', listingSchema.getOwnListingsSoldSchema,listings.getOwnListingsSold);
    fastify.get('/listings/mine/bought',listingSchema.getOwnListingsBoughtSchema, listings.getOwnListingsBought);
    fastify.get('/listings/mine', listingSchema.getOwnListingsSchema, listings.getOwnListings);
    fastify.get('/listings/user/:userId', listingSchema.getListingsByUserSchema, listings.getListingsByUser);
    fastify.get('/listings/:id', listingSchema.getListingDetailSchema, listings.getListingDetail);
    fastify.post('/listings', listingSchema.createListingSchema, listings.createListing);
    fastify.put('/listings/:id',listingSchema.updateListingSchema ,listings.updateListing);
    fastify.delete('/listings/:id',listingSchema.deleteListingSchema ,listings.deleteListing);
    fastify.get('/listings/random',listingSchema.randomLisitingSchema, listings.randomListing);
    fastify.get('/listings/search', listingSchema.searchListingSchema, listings.searchListing);
    fastify.patch('/listings/:id/reserve', listingSchema.reserveListingSchema, listings.reserveListing);
}   

export default listingRoutes;

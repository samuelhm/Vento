import { AppError } from "../utils/app-errors.js";

async function addToWishList(request, reply) {
    const { pg } = request.server;
    const { listingId } = request.body;
    const findListing = `
        SELECT user_id AS "userId" FROM listings 
        WHERE id = $1 
        AND state != 'sold' AND state != 'cancelled'
    `;
    const insertToWishlist = `
        INSERT INTO wishlists (listing_id, user_id) 
        VALUES ($1, $2)
        RETURNING listing_id AS "listingId", user_id AS "userId" , created_at as "createdAt" ;
    `;

    try{
        await request.jwtVerify();
        const { id : userId} = request.user;
        const { rows } = await pg.query(findListing, [listingId]);
        if(rows.length === 0)
            throw new AppError(`${listingId} not founded in db`, 'NOT_FOUND');
        if (rows[0].userId === userId)
            throw new AppError('Users cannot add their own listings to the wishlist', 'BAD_REQUEST' );
        const { rows: wishlist} = await pg.query(insertToWishlist, [listingId, userId]);
        return {"status": "success","message": `listing added to wishlist`, "data": wishlist[0] };
    }catch(error){
        if ( error.code === "22P02")
            throw new AppError('','NOT_FOUND');
        if( error.code === '23505' )
            throw new AppError(error.message, 'DUPLICATE_RECORD');
        throw error;
    }
}

async function removeFromWishlist(request, reply) {
    const { pg } = request.server;
    const { id: idListing } = request.params;
    const findListing = `
        SELECT user_id as "userId" 
        FROM wishlists 
        WHERE listing_id = $1 AND user_id = $2;
    `;
    const deletewishlist =`
        DELETE FROM wishlists
        WHERE listing_id = $1 AND user_id = $2
        RETURNING listing_id AS "listingId" , user_id AS "userId" , created_at AS "createdAt"
    `;
    try{
        await request.jwtVerify();
        const { id: userId } = request.user;
        const { rows: wishlist} = await pg.query(findListing, [idListing,userId]);
        if( wishlist.length === 0 )
            throw new AppError(`${idListing} not founded in db`, 'NOT_FOUND');
        if( wishlist[0].userId !== userId)
            throw new AppError(`You do not have permission to remove from wishlist`, 'FORBIDDEN' );
        const { rows: deleteWishlist} = await pg.query(deletewishlist,[idListing, userId]);
        return {"status": "success", "message": "Listing removed from wishlist", "data": deleteWishlist[0]};
    }catch(error){
        if ( error.code === "22P02")
            throw new AppError('','NOT_FOUND');
        throw error;
    }
}

async function getWishlist(request, reply) {
    const { pg } = request.server;
    const selectUserwishlist = `
        WITH photo_CTE AS (

        SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
        FROM photos
        GROUP BY listing_id
        )
    
        SELECT l.id , title, description, price, state, l.created_at AS "createdAt", 
        ST_X(location) AS longitude, ST_Y(location) AS  latitude, 
        lc.categorie_id AS "categoryId" , c.name AS "categoryName" , p.photos AS photos
        FROM listings AS l
        INNER JOIN listing_categories AS lc ON l.id = lc.listing_id
        INNER JOIN categories AS c ON lc.categorie_id = c.id
        INNER JOIN wishlists AS w ON w.listing_id = l.id
        LEFT JOIN photo_CTE p ON l.id = p.listing_id
        WHERE w.user_id = $1 AND l.state != 'cancelled' AND l.state != 'sold';
    `;
    await request.jwtVerify();
    const { id: userId } = request.user;
    const { rows: wishlist} = await pg.query(selectUserwishlist,[userId]);
    return {"status": "success", "data": wishlist};
}

async function getWishlistCount(request,reply){
    const { pg } = request.server;
    const { idListing } = request.params;
    const wishlistCount = {};
    const SelectTotalwishlist = `
        SELECT listing_id AS "listingId",  COUNT(listing_id) AS "TotalWishlistCount" 
        FROM wishlists
        WHERE listing_id = $1
        GROUP BY listing_id;
    `;
    const { rows } = await pg.query(SelectTotalwishlist,[idListing]);
    wishlistCount.listingId = idListing;
    wishlistCount.TotalWishlistCount = rows.length !== 0 ? rows[0].TotalWishlistCount : 0;
    return {"status": "success", "data": wishlistCount};
}



export default {addToWishList, removeFromWishlist, getWishlist, getWishlistCount};

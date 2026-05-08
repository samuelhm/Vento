import { AppError } from "../utils/app-errors.js";

async function createTransaction(request, reply) {
    const client = await request.server.pg.connect();
    const {listingId , sellerId, buyerId, price} = request.body;
    const findListing = `
        SELECT id AS listing , user_id AS user 
        FROM listings 
        WHERE id = $1 AND state != 'cancelled' AND state != 'sold'
    `;
    const createTransaction = `
        INSERT INTO transactions (listing_id, buyer_id, seller_id, price)
        VALUES($1, $2, $3 , $4)
        RETURNING *;
    `;
    const updateListing = `
        UPDATE listings
        SET state = 'sold'
        WHERE id = $1
    `;
    try{
        await request.jwtVerify();
        const { id: userId } = request.user;
        if (userId !== sellerId)
            throw new AppError('User and seller must be the same', 'BAD_REQUEST');
        if ( buyerId === sellerId)
            throw new AppError(`Seller and buyer cannot be the same`, 'BAD_REQUEST');
        await client.query('BEGIN');
        const { rows: listing} = await client.query(findListing,[listingId]);
        if(listing.length === 0)
            throw new AppError(`${listingId} not founded in db`, 'NOT_FOUND');
        if(userId !== listing[0].user)
                  throw new AppError(`You do not have permission to create this transaction`, 'FORBIDDEN' );
        const { rows: transaction} = await client.query(createTransaction,[listingId, buyerId, sellerId, price]);
        client.query(updateListing,[listingId]);
        await client.query('COMMIT');
        return {"status": "success", "message": "Transaction created successfully", "data": listing[0]};
    }catch(error)
    {
        await client.query('ROLLBACK');
        if ( error.code === "22P02")
            throw new AppError('','NOT_FOUND');
        throw error;
    }finally{
        client.release();
    }
}

export default {createTransaction};
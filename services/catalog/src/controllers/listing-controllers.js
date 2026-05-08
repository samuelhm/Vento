import { AppError } from "../utils/app-errors.js";
import utils from "../utils/listing-services.js";
import { buildSearchQuery } from "../utils/listing-query-builder.js";

async function getListingDetail(request, reply) {
  const { pg } = request.server;
  const { id: idListing} = request.params;
  let userId = null;
  try{
    await request.jwtVerify();
    userId = request.user.id;
  }catch(error)
  {
    userId = null;
  }
  const selectReview = `
    SELECT buyer_id AS "buyerId", stars, review, created_at AS "createdAt"
    FROM reviews
    WHERE listing_id = $1
  `;
  const selectListing =`
    WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
    )

    SELECT l.id , l.user_id AS "userId",  l.title, l.description, l.price, l.state, l.created_at AS "createdAt", 
      ST_X(l.location) AS longitude, ST_Y(l.location) AS latitude,
      lc.categorie_id AS "categoryId" , c.name AS "categoryName" , p.photos AS photos,
      w.id NOTNULL AS wishlist
    FROM listings AS l
    INNER JOIN listing_categories AS lc ON l.id = lc.listing_id
    INNER JOIN categories AS c ON lc.categorie_id = c.id
    LEFT JOIN wishlists AS w ON l.id = w.listing_id AND w.user_id = $2
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    WHERE l.id = $1 AND l.state != 'cancelled'
  `;
    const { rows: listing} = await pg.query(selectListing,[idListing, userId]);
    if(listing.length === 0)
        throw new AppError(`${idListing} not founded in db`, 'NOT_FOUND');
    const { rows: review } = await pg.query(selectReview, [idListing]);
    const currentListing = listing[0];
    currentListing.review = review.length != 0 ? review[0] : null ;
    return{
    "status": "success",
    "data": currentListing
    };
  }

async function getListingsByUser(request,reply) {
  const { pg } = request.server;
  const { userId: sellerId} = request.params;
  let userId = null;
  try{
      await request.jwtVerify();
      userId = request.user.id;
  }catch(error)
  {
      userId = null;
  }
  const selectUserListings = `
  WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
  ),
  review_average AS (
    SELECT l.user_id , ROUND(AVG(r.stars),1) AS reviewavg
    from listings AS l
    LEFT JOIN reviews AS r ON l.id = r.listing_id 
    GROUP BY l.user_id)

 SELECT l.id , title, description, price, state, l.created_at AS "createdAt", 
      ST_X(location) AS longitude, ST_Y(location) AS  latitude, 
      lc.categorie_id AS "categoryId" , c.name AS "categoryName" , p.photos AS photos,
      w.id NOTNULL AS wishlist, a.reviewAvg AS "reviewAvg"
    FROM listings AS l
    INNER JOIN listing_categories AS lc ON l.id = lc.listing_id
    INNER JOIN categories AS c ON lc.categorie_id = c.id
    LEFT JOIN wishlists AS w ON l.id = w.listing_id AND w.user_id = $2
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    LEFT JOIN review_average AS a ON l.user_id = a.user_id
    WHERE l.user_id = $1 AND l.state != 'cancelled';
  `;
    const {rows: userListings} = await pg.query(selectUserListings, [sellerId, userId]);
    return {"status": "success", "data": userListings};
}

async function getOwnListings(request, reply) {
  const { pg } = request.server;
  const selectUserListings = `
  WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
  ),
  review_average AS (
    SELECT l.user_id , ROUND(AVG(r.stars),1) AS reviewavg
    from listings AS l
    LEFT JOIN reviews AS r ON l.id = r.listing_id 
    GROUP BY l.user_id)

 SELECT l.id , title, description, price, state, l.created_at AS "createdAt", 
      ST_X(location) AS longitude, ST_Y(location) AS  latitude, 
      lc.categorie_id AS "categoryId" , c.name AS "categoryName" , p.photos AS photos,
      w.id NOTNULL AS wishlist, a.reviewAvg AS "reviewAvg"
    FROM listings AS l
    INNER JOIN listing_categories AS lc ON l.id = lc.listing_id
    INNER JOIN categories AS c ON lc.categorie_id = c.id
    LEFT JOIN wishlists AS w ON l.id = w.listing_id AND w.user_id = $1
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    LEFT JOIN review_average AS a ON l.user_id = a.user_id
    WHERE l.user_id = $1 AND l.state != 'cancelled';
  `;
    await request.jwtVerify();
    const { id } = request.user;
    const { rows: ownListings } = await pg.query(selectUserListings,[id]);
    return {"status": "success", "data": ownListings};
}

async function getOwnListingsBought(request, reply) {
  
  const { pg } = request.server;
  const selectBoughtListing = `
  
  WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
 )
 
 SELECT l.id AS "listingId", t.buyer_id AS "buyerId", title, l.price AS "listinPrice", t.price AS "transactionPrice", state, l.created_at AS "listingDate", 
        t.created_at AS "transactionDate",p.photos AS photos
    FROM listings AS l
    INNER JOIN transactions AS t ON t.listing_id = l.id
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    WHERE t.buyer_id = $1;
  `;
  await request.jwtVerify();
  const { id } = request.user;
  const { rows: boughtListing } = await pg.query(selectBoughtListing,[id]);
  return {"status": "success", "data": boughtListing};
}

async function getOwnListingsSold(request, reply) {
   const { pg } = request.server;
   const selectSoldListing = `
   WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
    )
 
    SELECT l.id AS "listingId", t.seller_id AS "sellerId", title, l.price AS "listinPrice", t.price AS "transactionPrice", state, l.created_at AS "listingDate", 
        t.created_at AS "transactionDate", p.photos AS photos
    FROM listings AS l
    INNER JOIN transactions AS t ON t.listing_id = l.id
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    WHERE t.seller_id = $1;
   `;
  await request.jwtVerify();
  const { id } = request.user;
  const { rows: soldListing } = await pg.query(selectSoldListing,[id]);
  return {"status": "success", "data": soldListing};
}


async function createListing(request, reply) {
  const client = await request.server.pg.connect();
  const { title , description, price, latitude, longitude, idCategory , photos} = request.body;
  const insertListing = `
    INSERT INTO listings (user_id,title,description, price,location)
    VALUES
    ($1,$2,$3,$4,ST_SetSRID(ST_Point($5, $6), 4326))
    RETURNING * ,  ST_X(location) AS longitude, ST_Y(location) as latitude;
    `;
  const insertCategory  = `
    INSERT INTO listing_categories(listing_id, categorie_id)
    VALUES
    ($1,$2)
    RETURNING *;
    `;
  try{
    await request.jwtVerify();
    const { id } = request.user;
    await client.query('BEGIN');
    const { rows: createListing } = await client.query(insertListing,[id, title, description, price, longitude, latitude]);
    const { rows: insertedCategory } = await client.query(insertCategory,[createListing[0].id, idCategory]);
    const listing = createListing[0];
    listing.idCategory = insertedCategory[0].categorie_id;
    listing.photos = await utils.saveListingPhotos(client, createListing[0].id, photos);
    await client.query('COMMIT');
    return{"status": "success", "message": "Listing created successfully","data": createListing[0]}; 
  }catch(error){
    await client.query('ROLLBACK');
    if(error.code === '23505'){
      const ErrorCode = error.constraint === 'unique_listing_photo_order' ? 'PHOTO_POSITION_TAKEN':'DUPLICATE_RECORD';
      throw new AppError('',ErrorCode);
    }
    throw error;
  }finally{
      client.release();
  }    
}

async function updateListing(request, reply) {
  const client = await request.server.pg.connect();
  const { title , description, price, latitude, longitude, idCategory, photos } = request.body;
  const { id: idListing } = request.params;
  const findListing = 
    `SELECT id , user_id AS user, state 
    FROM listings WHERE id = $1 AND state != 'cancelled'`;
  const updateListing = `
    UPDATE listings
    SET title = $1, description = $2, price = $3, location = ST_SetSRID(ST_Point($4, $5), 4326)
    WHERE id = $6
    RETURNING *,  ST_X(location) AS longitude, ST_Y(location) as latitude;`;
  const updateCategories = `
    UPDATE listing_categories
    SET categorie_id = $1
    WHERE listing_id = $2
    RETURNING categorie_id AS categorie, listing_id AS listing;
  `;
  try{
    await request.jwtVerify();
    const { id } = request.user;
    await client.query('BEGIN');
    const { rows: currentListing } = await client.query(findListing, [idListing]);
    if(currentListing.length === 0)
      throw new AppError(`${idListing} not founded in db`, 'NOT_FOUND');
    if(currentListing[0].user !== id)
      throw new AppError(`You are not allow to modify ${idListing}`, 'FORBIDDEN' );
    if(currentListing[0].state === 'sold')
      throw new AppError('Sold listings cannot be modified or updated.', 'BAD_REQUEST');
    const { rows: updatedListing } = await client.query(updateListing,[title, description, price, longitude ,latitude, idListing]);
    const { rows: updateCatefories } = await client.query(updateCategories,[idCategory, idListing]);
    const listing = updatedListing[0];
    listing.photos = await utils.updateListingPhotos(client, idListing, photos);
    listing.idCategory = updateCatefories[0].categorie;
    await client.query('COMMIT');
    return {"status": "success", "message": "Listing updated successfully", "data": updatedListing[0]};
  }catch(error){
    await client.query('ROLLBACK');
    if(error.code === "22P02")
      throw new AppError('The requested listing does not exist.', 'NOT_FOUND');
    if(error.code === '23505'){
      const ErrorCode = error.constraint === 'unique_listing_photo_order' ? 'PHOTO_POSITION_TAKEN':'DUPLICATE_RECORD';
      throw new AppError('',ErrorCode);
    }
    throw error;
  }finally{
    client.release();
  }
}

async function deleteListing(request, reply) {
  const { pg } = request.server;
  const { id: idListing } = request.params;
  const findListing = `
  SELECT id AS listing , user_id AS user 
  FROM listings WHERE id = $1 AND state != 'cancelled' AND state != 'sold' `;
  const findTransactions = `
    SELECT * 
    FROM transactions
    WHERE listing_id =  $1`;
  const slqupdate = `
    UPDATE listings
    SET state = 'cancelled'
    WHERE id = $1
    RETURNING *`;
  const deleteWishlist = `
    DELETE FROM wishlists
    WHERE listing_id = $1
    `;
  try{
    await request.jwtVerify();
    const { id } = request.user; 
    const { rows: currentListing } = await pg.query(findListing, [idListing]);
    if(currentListing.length === 0)
      throw new AppError(`${idListing} not founded in db`, 'NOT_FOUND');
    if(currentListing[0].user !== id)
      throw new AppError(`You are not allow to modify ${idListing}`, 'FORBIDDEN' );
    const { rows: transactions } = await pg.query(findTransactions,[idListing]);
    if(transactions.length > 0)
      throw new AppError(`${idListing} has pending transactions`, "TRANSACTIONS" );
    const { rows: deleteListing} = await pg.query(slqupdate,[idListing]);
    await pg.query(deleteWishlist,[idListing]);
    return {"status": "success", "message": "Listing deleted successfully", "data": deleteListing[0]};
  }catch(error)
  {
    if(error.code === "22P02")
      throw new AppError('The requested listing does not exist.', 'NOT_FOUND');
    throw error;
  }
}

async function randomListing(request, reply) {
   const { pg } = request.server;
   const countlistings = `
    SELECT COUNT(*)
    FROM listings
    WHERE state = 'pending' 
   `;
   const selectRandomListing =`
    WITH photo_CTE AS (

    SELECT listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path' , path, 'position', position) ORDER BY id) AS photos
    FROM photos
    GROUP BY listing_id
  ),
    review_average AS (
    SELECT l.user_id , ROUND(AVG(r.stars),1) AS reviewavg
    from listings AS l
    LEFT JOIN reviews AS r ON l.id = r.listing_id 
    GROUP BY l.user_id)


   SELECT l.id , l.user_id AS "userId",  title, description, price, state, created_at AS "createdAt", 
      ST_X(location) AS latitude, ST_Y(location) AS longitude,
      lc.categorie_id AS "categoryId" , c.name AS "categoryName", p.photos AS photos,a.reviewAvg AS "reviewAvg"
    FROM listings AS l
    INNER JOIN listing_categories AS lc ON l.id = lc.listing_id
    INNER JOIN categories AS c ON lc.categorie_id = c.id
    LEFT JOIN photo_CTE p ON l.id = p.listing_id
    LEFT JOIN review_average AS a ON l.user_id = a.user_id
    WHERE l.state = 'pending'
    LIMIT 1 OFFSET $1 ;
    `;
  const { rows: listngNumbers} = await pg.query(countlistings);
  const { count } = listngNumbers[0];
  const randomNumber = Math.floor(Math.random() * (count - 1));
  const { rows: randomListing } = await pg.query(selectRandomListing, [randomNumber]);
  const listing =  randomListing[0];
  listing.photos = await utils.getListingPhotos(pg, randomListing[0].id);      
  return({"status": "success","data": listing});      
}

async function searchListing(request, reply) {

  const { pg } = request.server;
  const query = request.query;
  const { sqlbase, reviewsAvg , photos, select , count, joins, 
          photosJoins, where, orderBy, offset, userData , reviewsJoins } = await buildSearchQuery(request, query);
  const slqCount = sqlbase + " " + count + " " + joins + " " + where;
  const sqlSelect = sqlbase + ", " + reviewsAvg +  ", " + photos + " " + select + " " +  joins + " " + photosJoins + " " + reviewsJoins + " "   + where + " " + orderBy + " " + offset;
  const { rows: counts } = await pg.query(slqCount,userData.slice(0,userData.length - 1));
  const { rows : listings } = await pg.query(sqlSelect, userData);
  return({"status": "success", "data": {"listings": listings, "total_items": counts}});      
}

async function reserveListing(request, reply) {
  const { pg } = request.server;
  const {id: idListing} = request.params;
  const updateListings = `
    UPDATE listings
    SET state = $1
    WHERE id = $2
    RETURNING * 
  `;
  const selectListing = `
    SELECT id , user_id AS user, state 
    FROM listings
    WHERE id = $1 
    AND state != 'sold' AND state != 'cancelled';
  `;
  await request.jwtVerify();
  const { id } = request.user;
  const { rows : listing} = await pg.query(selectListing, [idListing]);
  if(listing.length === 0)
    throw new AppError(`${idListing} has been deleted or sold.`, 'NOT_FOUND');
  if(listing[0].user !== id)
    throw new AppError(`You are not allow to modify ${idListing}`, 'FORBIDDEN' );
  const listingState = listing[0].state === 'pending' ? 'reserved': 'pending';
  const { rows : updated} = await pg.query(updateListings,[listingState, listing[0].id]);
  return {"status": "success", "message": "Listing update state successfully", "data": updated[0]};
}


export default {createListing, updateListing, reserveListing,getOwnListingsSold, getOwnListingsBought,
                getOwnListings, randomListing, getListingDetail, searchListing, deleteListing, getListingsByUser};
 
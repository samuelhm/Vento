import { AppError } from "../utils/app-errors.js";

async function createReviews(request, reply) {
  const { pg } = request.server;
  const { listingId, stars, review} = request.body;
  const getTransaction = `
    SELECT id , listing_id, buyer_id
    FROM transactions
    WHERE listing_id = $1
  `;
  const insertReview = `
    INSERT INTO reviews (listing_id, trasaction_id, buyer_id, stars, review)
    VALUES
    ($1, $2, $3, $4, $5 )
    RETURNING listing_id AS "listingId", buyer_id AS "buyerId", stars,
    review, created_at AS "createdAt";
  `;
  try{
    await request.jwtVerify();
    const { id: userId } = request.user;
    const { rows: transactions } = await pg.query(getTransaction, [listingId]);
    if(transactions.length === 0)
      throw new AppError(`${listingId} does not have any associated transactions`, 'NOT_FOUND');
    if(userId !== transactions[0].buyer_id)
      throw new AppError(`You do not have permission to create a review`, 'FORBIDDEN' );
    const insertValues = [listingId,transactions[0].id,transactions[0].buyer_id, stars, review];
    const { rows: reviews} = await pg.query(insertReview,insertValues);
    return {"status": "success",  "message": "Review created successfully", "data": reviews[0]};
  }catch(error){
      if ( error.code === "22P02")
        throw new AppError('','NOT_FOUND');
      if( error.code === '23505' )
        throw new AppError(error.message, 'DUPLICATE_RECORD');
      throw error;
  } 
};

async function getReviewsByUser(request, reply) {
  const { pg } = request.server;
  const getReviews = `
    SELECT l.id AS "listingId", l.title, cat.name AS "categoryName", 
    r.buyer_id AS "buyerId", r.stars, r.review, r.created_at AS "createdAt", p.path
    FROM reviews AS r
    INNER JOIN listings AS l ON l.id = r.listing_id
    LEFT JOIN listing_categories lc ON l.id = lc.listing_id
    LEFT JOIN categories cat ON lc.categorie_id = cat.id
    INNER JOIN photos AS p ON l.id = p.listing_id AND p.position = 1
    where l.user_id = $1
  `;
  const { userId } = request.params;
  const { rows: ownReviews } = await pg.query(getReviews, [userId]);
  return {"status": "success", "data": ownReviews};
};

async function getReviewStatsByUser(request, reply) {
  const { pg } = request.server;
  const { userId } = request.params;
  const getReviewStats = `
    SELECT l.user_id ,COUNT(r.stars) AS "totalReviews", ROUND(AVG(r.stars),1) AS "reviewAvg"
    from listings AS l
    LEFT JOIN reviews AS r ON l.id = r.listing_id 
    WHERE l.user_id = $1
    GROUP BY l.user_id
  `;
  const { rows: reviewStats} = await pg.query(getReviewStats,[userId]);
  if (reviewStats.length === 0)
    return{"status": "success", "data": {"user_id":userId ,"totalReviews": 0, "reviewAvg": 0 }};  
  return{"status": "success", "data": reviewStats[0]};
}

export default {createReviews, getReviewsByUser, getReviewStatsByUser};
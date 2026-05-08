

export async function buildSearchQuery(request, query)
{
    const sqlBlocks = {};
    const sqlData = [];
    const state = {counter: 2};
    let userId = null;
    try{
        await request.jwtVerify();
        userId = request.user.id;
    }catch(error)
    {
        userId = null;
    }
    sqlData.push(userId);

    sqlBlocks.sqlbase = buildSqlBaseClause(query,state,sqlData);
    sqlBlocks.reviewsAvg = `
        review_average AS (
        SELECT l.user_id , ROUND(AVG(r.stars),1) AS reviewavg
        from listings AS l
        LEFT JOIN reviews AS r ON l.id = r.listing_id
        GROUP BY l.user_id)
    `;
    sqlBlocks.photos =
        `CTE_photos AS (
        SELECT p.listing_id , JSON_AGG(JSON_BUILD_OBJECT('photoId', id, 'path', path, 'position', position) ORDER BY position) AS photos
        FROM photos AS p
        GROUP BY p.listing_id)`;
    sqlBlocks.select =
        `SELECT l.id, l.user_id AS "userId", l.title, l.description, l.price as price, l.state,
        l.created_at AS "createdAt", ST_X(l.location) AS longitude, ST_Y(l.location) as latitude,
        f.name AS "categoryName" ,f.id  AS "categoryId",  p.photos , w.id NOTNULL AS wishlist , a.reviewAvg AS "reviewAvg"
        FROM hierachy f`;
    sqlBlocks.count =
        `SELECT COUNT(DISTINCT  l.id)
        FROM hierachy f \n`;
    sqlBlocks.joins =
        `JOIN listing_categories AS lc ON lc.categorie_id = f.id
        JOIN listings AS l ON l.id = lc.listing_id
        LEFT JOIN wishlists AS w ON l.id = w.listing_id AND w.user_id = $1`
        ;
    sqlBlocks.photosJoins = `LEFT JOIN CTE_photos AS p ON p.listing_id = l.id`;
    sqlBlocks.reviewsJoins = `LEFT JOIN review_average AS a ON l.user_id = a.user_id`;
    sqlBlocks.where = buildWhereClause(query,state,sqlData);
    sqlBlocks.orderBy = buildOrderByClause(query);
    sqlBlocks.offset = buildOffsetClause(query,state,sqlData);
    sqlBlocks.userData = sqlData;
    return sqlBlocks;
}

function buildSqlBaseClause(query , state , sqlData)
{

    let categoryId = "WHERE ";
    if(Object.hasOwn(query,"categoryId"))
    {
          categoryId += "id = $" + state.counter ++;
          sqlData.push(query["categoryId"]);
    }
    else
        categoryId += "parent_id IS NULL";
    const sqlStatement =
        `WITH RECURSIVE hierachy AS (
        SELECT id , name , parent_id
        FROM categories
        ${categoryId}

        UNION ALL

        SELECT c.id , c.name , c.parent_id
        FROM categories AS c
        JOIN hierachy AS h ON c.parent_id = h.id)
        `;
    return sqlStatement;
}

function buildWhereClause(query, state, sqlData){
    let parameters ="";
    const filterArr= [];
    const filterMap = {
        get minPrice() {return  `price >= ${parameters}`;},
        get maxPrice() {return `price <= ${parameters}`;},
        get timeFilter() { return `l.created_at >= CURRENT_DATE - (INTERVAL '1 DAYS' * ${parameters} )`;},
        get keywords() {return `to_tsvector('spanish', coalesce(l.title, '') || ' ' || coalesce(l.description, '')) @@ plainto_tsquery('spanish', ${parameters})`;}
    };
    const timeFilterMap = {
        "today" : 0,
        "lastWeek": 7,
        "lastMonth": 30
    };
    filterArr.push("l.state NOT IN ('cancelled', 'sold')");

    for (const value in filterMap)
        {
            if(Object.hasOwn(query,value))
                {
                    parameters = "$"+ state.counter++;
                    filterArr.push(filterMap[value]);
                    if(value === "timeFilter")
                        sqlData.push(timeFilterMap[query[value]]);
                    else
                        sqlData.push(query[value]);
                }
            }
    if(Object.hasOwn(query, 'lng') && Object.hasOwn(query, 'lat') && Object.hasOwn(query, 'radius'))
        filterArr.push(buildGeoFilter(query,state,sqlData));
    return `WHERE ${filterArr.join(" AND ")}`;
}

function buildOrderByClause(query)
{
    const lng = Object.hasOwn(query,"lng") ? query.lng: -3.703429994493817;
    const lat = Object.hasOwn(query,"lat") ? query.lat: 40.41680711317895;
    let orderBy = "ORDER BY ";
    const orderMap = {
        "price_low_to_high": "price ASC, l.id ASC",
        "price_high_to_low": "price DESC, l.id DESC",
        "newest":  "l.created_at DESC, l.id DESC",
        "closest": `l.location::geography <-> ST_SetSRID(ST_Point(${lng}, ${lat}), 4326), l.id ASC`,
    };
    if(Object.hasOwn(query, "orderBy") && query.orderBy !== "closest" )
        orderBy += orderMap[query.orderBy];
    else
        orderBy += orderMap["closest"];

    return orderBy;
}

function buildOffsetClause(query, state, sqlData)
{
    let offset = "";
    const pages = 9;
    const parsedPage = Number.parseInt(query.page, 10);
    const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;

    offset = "$" + state.counter++;
    sqlData.push(page * pages);

    const sqlStatement =
        `LIMIT 9
        OFFSET ${offset}`;
    return sqlStatement;
}

function buildGeoFilter(query , state ,sqlData)
{
    const parameters = [];
    const geodata=
    {
        "lng" : "",
        "lat": "",
        "radius": "",
    };
    geodata.lng = query.lng;
    geodata.lat = query.lat;
    geodata.radius = query.radius * 1000;
    for(const value in geodata)
    {
        parameters.push("$" + state.counter++);
        sqlData.push(geodata[value]);
    }
    const sql = `ST_DWithin(l.location::geography, ST_SetSRID(ST_Point(${parameters[0]}, ${parameters[1]}),4326)::geography, ${parameters[2]})`;
    return sql;
}

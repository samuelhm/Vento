
async function getAllCategories(request, reply)
{
    const { pg } = request.server;
    const sqlStatement = `
    WITH RECURSIVE cat_CTE AS (
    SELECT id, name, id as base_category_id
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT c.id, c.name, t.base_category_id
    FROM categories c
    JOIN cat_CTE t ON c.parent_id = t.id
    )
    SELECT c.base_category_id AS id,
        (SELECT name FROM categories WHERE c.base_category_id = ID) AS name,
        COUNT(p.id) as count
    FROM cat_CTE c
    LEFT JOIN listing_categories l ON l.categorie_id = c.id
    LEFT JOIN listings AS p ON l.listing_id = p.id AND p.state != 'cancelled' AND p.state != 'sold'
    GROUP BY c.base_category_id
    ORDER BY name;
    `;
    const { rows } = await pg.query(sqlStatement);
    return ({"status": "success", "data": rows});
}

async function getCategoryTree(response, reply) {
    const { pg } = response.server;
    const sqlStatement = `
    WITH RECURSIVE hierarchy AS (
    SELECT id, name, parent_id , CAST(name AS VARCHAR(355)) AS path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL
    SELECT c.id , c.name , c.parent_id , CAST(CONCAT(h.path ,'>', c.name) AS VARCHAR(355)) AS path
    FROM categories c
    JOIN hierarchy h ON c.parent_id = h.id
    )
    SELECT h.id , h.name , h.parent_id AS parent , h.path , COUNT(p.id) AS count
    FROM hierarchy h
    LEFT JOIN listing_categories l ON l.categorie_id = h.id
    LEFT JOIN listings AS p ON l.listing_id = p.id AND p.state != 'cancelled' AND p.state != 'sold'
    GROUP BY h.id, h.name, parent, h.path
    ORDER BY h.id`;
    const { rows } = await pg.query(sqlStatement);
    const categoryTree = buildCategoryHierarchy(rows);
    return({"status": "success", "data": categoryTree});
}

function buildCategoryHierarchy(result){
     const treeMap = new Map();
     const rootCategories = [];
    result.forEach(element => {
        treeMap.set(element.id, {...element, "subcategories": []});
    });
    result.forEach((element)=>{
        if(element.parent)
        {    
            const parent = treeMap.get(element.parent);
            parent.subcategories.push(treeMap.get(element.id));
        }
        else
            rootCategories.push(treeMap.get(element.id));  
    });
    rootCategories.forEach(element=>{
        element.count = aggregateAdCounts(element);
    });
    return rootCategories;
}

function aggregateAdCounts(node){
    let total = Number(node.count);
    if(node.subcategories.length) 
    { 
        node.subcategories.forEach(element =>{
            total = total + aggregateAdCounts(element);
        });
    }
    node.count = total;
    return(total);
    }
    


export default {
    getAllCategories, getCategoryTree
};

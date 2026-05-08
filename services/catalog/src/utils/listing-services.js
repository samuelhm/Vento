
export async function saveListingPhotos(dbclient, idListing, photos) {
    const insertPhotos = `
      INSERT INTO photos (listing_id, path, position)
      VALUES
      ($1, $2, $3)
      RETURNING path, position;
      `;
    const result = [];
    for(const element of photos) {
        const { rows } = await dbclient.query(insertPhotos,[idListing, element.path, element.position]);
        result.push(rows[0]);
    }
    return result;
}

export async function getListingPhotos(pg, idListing) {
    const selectPhotos = `
        SELECT p.path , p.position , p.id as "photoId"
        FROM photos p
        WHERE p.listing_id = $1
    `;
    const { rows } = await pg.query(selectPhotos,[idListing]);
    return rows;
}

export async function deleteListingPhotos(dbclient, idListing) {
    const deletePhotos =`   
    DELETE FROM photos
    WHERE photos.listing_id = $1
    `;
    await dbclient.query(deletePhotos, [idListing]);
}

export async function updateListingPhotos(dbclient, idListing, photos) {
    await deleteListingPhotos(dbclient, idListing);
    const insertPhotos = `
      INSERT INTO photos (listing_id, path, position)
      VALUES
      ($1, $2, $3)
      RETURNING path, position;
      `;
    const result = [];
    for(const element of photos) {
        const { rows } = await dbclient.query(insertPhotos,[idListing, element.path, element.position]);
        result.push(rows[0]);
    }
    return result;
}

export default{saveListingPhotos, getListingPhotos, deleteListingPhotos,updateListingPhotos};
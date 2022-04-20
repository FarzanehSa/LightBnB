const { pool } = require('./connection');

module.exports = {
  /// Users
  
  /**
   * Get a single user from the database given their email.
   * @param {String} email The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  
  getUserWithEmail: (email) => {
    return pool
      .query(`
        SELECT * FROM users
        WHERE email = $1;
      `,[email.toLowerCase()])
      .then((res) => {
        return res.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  
  getUserWithId: (id) => {
    return pool
      .query(`
      SELECT * FROM users
      WHERE id = $1;
      `,[id])
      .then((res) => {
        return res.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  /**
   * Add a new user to the database.
   * @param {{name: string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  
  addUser: (user) => {
    return pool
      .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `,[user.name, user.email.toLowerCase(), user.password])
      .then((res) => {
        console.log('🟢 Add new user!');
        return res.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  /// Reservations
  
  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  
  getAllReservations: (guest_id, limit = 10) => {
    return pool
      .query(`
      SELECT reservations.*, properties.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date DESC
      LIMIT $2;  
      `,[guest_id,limit])
      .then(res => {
        return res.rows;
      })
      .catch(err => {
        console.log(err.message);
      });
    },

  /// Properties
  
  /**
   * Get all properties.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the properties.
   */
  
  getAllProperties: (options, limit = 10) => {
  
    let queryParams = [];
    let queryString = `
    SELECT properties.*, AVG(rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id`;
    
    const whereStatment = [`WHERE`,`AND`];
    let index = 0;
  
    if (options.owner_id) {
      queryParams.push(`${(options.owner_id)}`);
      queryString += `\nWHERE owner_id = $${queryParams.length}`;
      index = 1;
    }
  
    if (options.city) {
      queryParams.push(`%${(options.city)}%`.toLowerCase());
      queryString += `\n${whereStatment[index]} LOWER(city) LIKE $${queryParams.length}`;
      index = 1;
    }
    
    
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `\n${whereStatment[index]} (cost_per_night / 100) >= $${queryParams.length}`;
      index = 1;
    }
    
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `\n${whereStatment[index]} (cost_per_night / 100) <= $${queryParams.length}`;
      index = 1;
    }
    
    queryString += `\nGROUP BY properties.id`;

    if (options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `\nHAVING AVG(rating) >= $${queryParams.length}`;
      index = 1;
    }
    
    if (limit) {
      queryParams.push(`${limit}`);
      queryString += `\nORDER BY cost_per_night
      LIMIT $${queryParams.length};`;
    }
    return pool
      .query(queryString, queryParams)
      .then((res) => {
        return res.rows;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  
  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  
  addProperty: (property) => {
    return pool
      .query(`
      INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `,[property.owner_id, property.title, property.description,
        property.thumbnail_photo_url, property.cover_photo_url,
        property.cost_per_night * 100, property.street, property.city,
        property.province, property.post_code, property.country,
        property.parking_spaces || 0,
        property.number_of_bathrooms || 0,
        property.number_of_bedrooms || 0])
      .then((res) => {
        console.log('🟢 Add new property!');
        console.log(res.rows[0]);
        return res.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};
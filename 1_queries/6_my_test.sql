/* SELECT owner_id
FROM properties
WHERE title = 'Shoulder proud';

SELECT properties.id, title, cost_per_night, AVG(rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
WHERE owner_id = 1
GROUP BY properties.id
ORDER BY cost_per_night
LIMIT 10;

SELECT properties.*, AVG(rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
WHERE owner_id = 1
GROUP BY properties.id
ORDER BY cost_per_night
LIMIT 10;

select * from users
where email= '1@g.com'; */

DELETE FROM properties
WHERE id = 1003;
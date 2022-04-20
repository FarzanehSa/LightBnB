/* Select the id, title, cost_per_night, and an average_rating from the properties table for properties located in Vancouver.
Order the results from lowest cost_per_night to highest cost_per_night.
Limit the number of results to 10.
Only show listings that have a rating >= 4 stars.
 */

SELECT properties.id, title, cost_per_night, AVG(rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
WHERE
owner_id = 1
-- AND city LIKE '%ancouver'
-- AND (cost_per_night / 100) < 500
-- AND (cost_per_night / 100) >= 100
GROUP BY properties.id
-- HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;

SELECT id, title, owner_id
FROM properties
ORDER BY id DESC

LIMIT 10;

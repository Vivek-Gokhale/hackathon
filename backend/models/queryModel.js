const Query = require('../schemas/querySchema'); // Adjust the path as needed


const createQuery = async (queryData) => {
  try {
    const query = new Query(queryData);
    const savedQuery = await query.save();
    return savedQuery;
  } catch (error) {
    console.error('Error creating query:', error);
    throw error;
  }
};

module.exports = { createQuery };

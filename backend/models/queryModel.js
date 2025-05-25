const Query = require('../schemas/querySchema'); // Adjust the path as needed
const Expert = require('../schemas/expertSchema');

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

const assignQuery = async ({ queryId, expertId }) => {
  try {
    // Step 1: Find the query and update its expertId
    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { expertId },
      { new: true }
    );

    if (!updatedQuery) {
      throw new Error('Query not found');
    }

    // Step 2: Push the queryId into the expert's assigned_queries array
    const updatedExpert = await Expert.findByIdAndUpdate(
      expertId,
      { $push: { assigned_queries: queryId } },
      { new: true }
    );

    if (!updatedExpert) {
      throw new Error('Expert not found');
    }

    return { updatedQuery, updatedExpert };
  } catch (error) {
    console.error('Error assigning query to expert:', error);
    throw error;
  }
};

module.exports = { createQuery, assignQuery };

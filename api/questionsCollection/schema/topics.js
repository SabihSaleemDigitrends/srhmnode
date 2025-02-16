const getTopicsHandler = async (req, res) => {
  try {
    // Access topics collection from request
    const topicsCollection = req.topicsCollection;

    // Fetch all topics (excluding sensitive data like passwords)
    const document = await topicsCollection.find({}).toArray();

    res.status(200).json({
      data: document[0],
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching topics.',
    });
  }
};

export default getTopicsHandler;

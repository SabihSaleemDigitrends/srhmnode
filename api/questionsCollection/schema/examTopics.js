const getExamTopicsHandler = async (req, res) => {
  try {
    // Access topics collection from request
    const examTopicsCollection = req.examTopicsCollection;

    // Fetch all topics (excluding sensitive data like passwords)
    const document = await examTopicsCollection.find({}).toArray();

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

export default getExamTopicsHandler;

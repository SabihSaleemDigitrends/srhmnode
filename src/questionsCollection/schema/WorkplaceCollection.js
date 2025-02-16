const getWorkplaceHandler = async (req, res) => {
  try {
    // Access questions collection from request
    const WorkplaceCollection = req.WorkplaceCollection;

    // Fetch all questions (excluding sensitive data like passwords)
    const document = await WorkplaceCollection.find({}).toArray();
    // console.log('document', document);

    res.status(200).json({
      data: document[0],
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching questions.',
    });
  }
};

export default getWorkplaceHandler;

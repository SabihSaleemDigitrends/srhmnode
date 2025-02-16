const getBusinessHandler = async (req, res) => {
  try {
    const {BusinessCollection} = req;

    // Fetch the business document
    const businessDocument = await BusinessCollection.findOne();

    if (!businessDocument) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: businessDocument.Business,
    });
  } catch (error) {
    console.error('Error fetching business data:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching business collection.',
    });
  }
};
export default getBusinessHandler;

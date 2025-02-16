const resetBusinessHandler = async (req, res) => {
  try {
    const {BusinessCollection} = req;

    // Reset all Business items to default state
    const result = await BusinessCollection.updateOne(
      {},
      {
        $set: {
          'Business.$[].isUnlocked': false,
          'Business.$[].isCompleted': false,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No business data found to reset',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Business data reset successfully',
    });
  } catch (error) {
    console.error('Error resetting business data:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting business data.',
    });
  }
};
export default resetBusinessHandler;

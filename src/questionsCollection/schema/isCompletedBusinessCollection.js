const updateIsCompletedHandler = async (req, res) => {
  try {
    const {topicsCollection} = req;
    const {topicId, isCompleted} = req.body;

    if (!topicId || typeof isCompleted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid topicId and isCompleted status',
      });
    }

    const result = await topicsCollection.updateOne(
      {'topics.id': topicId},
      {$set: {'topics.$.isCompleted': isCompleted}},
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Topic completion status updated successfully',
    });
  } catch (error) {
    console.error('Error updating completion status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating completion status.',
    });
  }
};
export default updateIsCompletedHandler;

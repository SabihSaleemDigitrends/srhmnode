const updateFavouriteHandler = async (req, res) => {
  try {
    const {questionsCollection} = req;
    const {topicId, id, isFavourite} = req.body;

    if (!topicId || !id || typeof isFavourite !== 'boolean') {
      return res.status(400).json({
        success: false,
        message:
          'Please provide valid topicId, question id, and isFavourite status.',
      });
    }

    // Find the document containing the question
    const questionData = await questionsCollection.findOne({
      'questions.id': id,
      'questions.topicID': topicId,
    });

    if (!questionData || !questionData.questions) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Find the specific question index
    const questionIndex = questionData.questions.findIndex(
      q => q.id === id && q.topicID === topicId,
    );

    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Update the specific question dynamically using the provided isFavourite value
    const result = await questionsCollection.updateOne(
      {_id: questionData._id},
      {
        $set: {[`questions.${questionIndex}.isFavourite`]: isFavourite},
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update favourite status',
      });
    }

    return res.status(200).json({
      success: true,
      message: isFavourite
        ? 'Added to favourites successfully'
        : 'Removed from favourites successfully',
      newStatus: isFavourite,
    });
  } catch (error) {
    console.error('Error updating favourite status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating favourite status.',
    });
  }
};

export default updateFavouriteHandler;

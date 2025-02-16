const removeTopicProgressHandler = async (req, res) => {
  try {
    const {id, subjectID} = req.body;

    if (!id || !subjectID) {
      return res.status(400).json({
        success: false,
        message: '`id` and `subjectID` are required.',
      });
    }

    const topicsCollection = req.topicsCollection;

    // Remove the progress key from the specified topic
    const result = await topicsCollection.updateOne(
      {
        'topics.id': id,
        'topics.subjectID': subjectID,
      },
      {
        $unset: {'topics.$.progress': ''},
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No topic found with id: ${id} and subjectID: ${subjectID}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Topic progress removed successfully.',
    });
  } catch (error) {
    console.error('Error removing topic progress:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while removing topic progress.',
    });
  }
};

export default removeTopicProgressHandler;

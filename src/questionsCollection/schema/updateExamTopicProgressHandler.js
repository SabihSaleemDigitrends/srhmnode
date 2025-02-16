const updateExamTopicProgressHandler = async (req, res) => {
  try {
    const {id, subjectID, progress} = req.body;

    if (!id || progress === undefined || !subjectID) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid request. `id`, `subjectID`, and `progress` are required.',
      });
    }

    const examTopicsCollection = req.examTopicsCollection;

    // Update the topic inside the nested array
    const result = await examTopicsCollection.updateOne(
      {
        'topics.id': id,
        'topics.subjectID': subjectID,
      },
      {
        $set: {'topics.$.progress': progress},
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
      message: 'Topic progress updated successfully.',
    });
  } catch (error) {
    console.error('Error updating topic progress:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating topic progress.',
    });
  }
};

export default updateExamTopicProgressHandler;

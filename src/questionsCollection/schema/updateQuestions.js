const updateQuestionHandler = async (req, res) => {
  try {
    // Access the questions collection from the request
    const questionsCollection = req.questionsCollection;

    // Extract data from the request body
    const {id, answer} = req.body;

    if (!id || !Array.isArray(answer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body. Provide 'id' and 'answer'.",
      });
    }

    // Determine if the question is solved (answer provided)
    const isSolved = answer.length > 0;

    // Update the question by id
    const result = await questionsCollection.updateOne(
      {'questions.id': id},
      {
        $set: {
          'questions.$.isSolved': isSolved,
          'questions.$.answer': answer,
        },
      },
    );

    // Check if the question was updated
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No question found with id: ${id}`,
      });
    }

    // Fetch the updated question
    const updatedDocument = await questionsCollection.findOne({
      'questions.id': id,
    });

    const updatedQuestion = updatedDocument.questions.find(
      question => question.id === id,
    );

    res.status(200).json({
      success: true,
      message: 'Question id solved successfully.',
      result: updatedQuestion,
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the question.',
    });
  }
};

export default updateQuestionHandler;

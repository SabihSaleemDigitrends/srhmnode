const updateIsUnlockedHandler = async (req, res) => {
  try {
    const {PeopleCollection} = req;
    const {topicId, isUnlocked} = req.body;

    if (!topicId || typeof isUnlocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid topicId and isUnlocked status',
      });
    }

    // Update the specific topic's isUnlocked status
    const result = await PeopleCollection.updateOne(
      {'People.id': topicId},
      {$set: {'People.$.isUnlocked': isUnlocked}},
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Topic unlock status updated successfully',
    });
  } catch (error) {
    console.error('Error updating unlock status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating unlock status.',
    });
  }
};
export default updateIsUnlockedHandler;

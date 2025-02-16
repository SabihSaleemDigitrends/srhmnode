import {v4 as uuidv4} from 'uuid';

async function authenticateDevice(req, res) {
  const {deviceId} = req.body;

  if (!deviceId) {
    return res.status(400).json({error: 'Device ID is required'});
  }

  try {
    // Check if a token already exists for this device
    const existingEntry = await req.deviceAuthCollection.findOne({deviceId});

    if (existingEntry) {
      return res.status(200).json({token: existingEntry.token});
    }

    // Generate a new token
    const token = uuidv4();

    // Store deviceId and token in the collection
    await req.deviceAuthCollection.insertOne({deviceId, token});

    return res.status(201).json({token});
  } catch (error) {
    console.error('Error authenticating device:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
}

export default authenticateDevice;

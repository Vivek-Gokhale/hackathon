const { spawn } = require('child_process');
const path = require('path');
const farmerModel = require('../models/farmerModel');
const { createQuery } = require('../models/queryModel');

const runPythonScript = (args) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', args, {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });

        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (err) => {
            console.error('Python Error:', err.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(new Error('Python script failed'));
            }
        });
    });
};

const addQuery = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);

        const { email } = req.body;
        const image_path = req.body.imagePath || null;
        const voice_path = req.body.audioPath || null;
        let queryInNativeLanguage = req.body.queryInNativeLanguage || null;

        if (!email || (!queryInNativeLanguage && !voice_path)) {
            return res.status(400).json({
                message: "Either queryInNativeLanguage or voice_path is required, along with email",
            });
        }

        // Find the farmer
        const existingFarmer = await farmerModel.getByEmail(email);
        if (!existingFarmer) {
            return res.status(404).json({ message: "Farmer not found with given email" });
        }

        const voiceScriptPath = path.join(__dirname, '../utils/voice_utils.py'); // Declare once

        // If no text query is present, transcribe from audio
        if (!queryInNativeLanguage && voice_path) {
            const absoluteVoicePath = path.join(__dirname, '..', voice_path); // Convert to absolute file path
            queryInNativeLanguage = await runPythonScript(['-u', voiceScriptPath, 'voice', absoluteVoicePath]);

        }

        // Translate to English
        const translateScriptPath = path.join(__dirname, '../utils/voice_utils.py');
        const queryInEnglish = await runPythonScript(['-u', translateScriptPath, 'translate', queryInNativeLanguage]);

        // Prepare query data
        const queryData = {
            farmerId: existingFarmer._id,
            queryInNativeLanguage,
            queryInEnglish,
            image_path,
            voice_path,
            submit_date: new Date(),
            solved_date: null,
            status: 'pending',
            expertId: null,
            rating: null
        };

        // Create query
        const newQuery = await createQuery(queryData);

        // Update farmer document with query ID
        existingFarmer.queries.push(newQuery._id);
        await existingFarmer.save();

        return res.status(201).json({ message: "Query submitted successfully", queryId: newQuery._id });

    } catch (error) {
        console.error("Error in addQuery:", error);
        next(error);
    }
};

module.exports = { addQuery };

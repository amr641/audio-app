import path from "path"
import fs from "fs"
import { body, param } from "express-validator"
import { escape } from "querystring";
const validateAudioFile = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,()'";:!?]+$/)
        .withMessage('Title contains invalid characters'),

    // Genre validation
    body('genre')
        .notEmpty()
        .withMessage('Genre is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Genre must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s\-&]+$/)
        .withMessage('Genre can only contain letters, spaces, hyphens, and ampersands'),

    // IsPrivate validation
    body('isPrivate')
        .optional()
        .isBoolean()
        .withMessage('isPrivate must be a boolean value')
        .toBoolean(), // Convert string to boolean

    // AddedBy validation (ObjectId)
    body('addedBy')
        .notEmpty()
        .withMessage('AddedBy is required')
        .isMongoId()
        .withMessage('AddedBy must be a valid MongoDB ObjectId')
        .optional(),

    body('audioFile')
        .custom((value, { req }) => {
            // Check if file exists in request
            if (!req.file) {
                throw new Error('Audio file is required');
            }

            const file = req.file;

            // Validate fieldname
            if (file.fieldname !== 'audioFile') {
                throw new Error('Invalid field name for audio file');
            }

            // Validate mimetype - audio files only
            const allowedMimeTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/ogg',
                'audio/aac',
                'audio/flac',
                'audio/m4a'
            ];

            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error('Invalid audio file type. Only audio files are allowed.');
            }

            // Validate file extension
            const allowedExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'];
            const fileExtension = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Invalid file extension. Allowed: ' + allowedExtensions.join(', '));
            }
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 10MB.');
            }

            const minSize = 1024; // 1KB in bytes
            if (file.size < minSize) {
                throw new Error('File size too small. Minimum size is 1KB.');
            }

            if (!file.originalname || file.originalname.trim() === '') {
                throw new Error('Original filename is required');
            }

            // Validate that file exists at the specified path
            if (!fs.existsSync(file.path)) {
                throw new Error('Uploaded file not found at specified path');
            }

            return true;
        }),

    // Additional validation for specific properties
    body('audioFile').custom((value, { req }) => {
        const file = req.file;

        // Validate destination path format
        if (!file.destination || !file.destination.startsWith('uploads/audio/')) {
            throw new Error('Invalid destination path');
        }

        // Validate filename format (timestamp-randomnumber.extension)
        const filenamePattern = /^\d{13}-\d+\.(mp3|wav|ogg|aac|flac|m4a)$/;
        if (!filenamePattern.test(file.filename)) {
            throw new Error('Invalid filename format');
        }

        // Validate encoding
        const allowedEncodings = ['7bit', '8bit', 'binary', 'base64'];
        if (!allowedEncodings.includes(file.encoding)) {
            throw new Error('Invalid file encoding');
        }

        return true;
    })
];
const updateAudioValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,()'";:!?]+$/)
        .withMessage('Title contains invalid characters'),

    // Genre validation
    body('genre')
        .notEmpty()
        .withMessage('Genre is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Genre must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s\-&]+$/)
        .withMessage('Genre can only contain letters, spaces, hyphens, and ampersands'),

    // IsPrivate validation
    body('isPrivate')
        .optional()
        .isBoolean()
        .withMessage('isPrivate must be a boolean value')
        .toBoolean(), // Convert string to boolean

    // AddedBy validation (ObjectId)
    body('addedBy')
        .notEmpty()
        .withMessage('AddedBy is required')
        .isMongoId()
        .withMessage('AddedBy must be a valid MongoDB ObjectId')
        .optional(),

    body('audioFile')
        .custom((value, { req }) => {
            // Check if file exists in request
            if (!req.file) {
                throw new Error('Audio file is required');
            }

            const file = req.file;

            // Validate fieldname
            if (file.fieldname !== 'audioFile') {
                throw new Error('Invalid field name for audio file');
            }

            // Validate mimetype - audio files only
            const allowedMimeTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/ogg',
                'audio/aac',
                'audio/flac',
                'audio/m4a'
            ];

            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error('Invalid audio file type. Only audio files are allowed.');
            }

            // Validate file extension
            const allowedExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'];
            const fileExtension = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Invalid file extension. Allowed: ' + allowedExtensions.join(', '));
            }
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 10MB.');
            }

            const minSize = 1024; // 1KB in bytes
            if (file.size < minSize) {
                throw new Error('File size too small. Minimum size is 1KB.');
            }

            if (!file.originalname || file.originalname.trim() === '') {
                throw new Error('Original filename is required');
            }

            // Validate that file exists at the specified path
            if (!fs.existsSync(file.path)) {
                throw new Error('Uploaded file not found at specified path');
            }

            return true;
        }),


    body('audioFile').custom((value, { req }) => {
        const file = req.file;


        if (!file.destination || !file.destination.startsWith('uploads/audio/')) {
            throw new Error('Invalid destination path');
        }


        const filenamePattern = /^\d{13}-\d+\.(mp3|wav|ogg|aac|flac|m4a)$/;
        if (!filenamePattern.test(file.filename)) {
            throw new Error('Invalid filename format');
        }

        const allowedEncodings = ['7bit', '8bit', 'binary', 'base64'];
        if (!allowedEncodings.includes(file.encoding)) {
            throw new Error('Invalid file encoding');
        }

        return true;
    })
]
const streamAudioValidation = [
    param('filename')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Filename is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Filename must be between 1 and 200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,()'";]+$/)
        .withMessage('Filename contains invalid characters')
]
export { validateAudioFile, streamAudioValidation }
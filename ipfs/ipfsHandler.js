import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

class IPFSHandler {
    constructor(ipfsNodeUrl = 'https://ipfs.infura.io:5001') {
        this.ipfs = create({ 
            host: 'ipfs.infura.io', 
            port: 5001, 
            protocol: 'https' 
        });
    }

    /**
     * Validate test results data
     * @param {Object} testResults - The test results data
     * @returns {Object} - Validated and formatted test results
     * @throws {Error} - If validation fails
     */
    validateTestResults(testResults) {
        const requiredFields = [
            'hiv',
            'hepatitisB',
            'hepatitisC',
            'syphilis',
            'malaria'
        ];

        // Check if all required fields are present and are boolean (except blood groups)
        for (const field of requiredFields) {
            if (field === 'aboGrouping') {
                if (!['A', 'B', 'AB', 'O'].includes(testResults[field])) {
                    throw new Error('Invalid ABO blood group. Must be A, B, AB, or O');
                }
                continue;
            }
            if (field === 'rhFactor') {
                if (!['positive', 'negative'].includes(testResults[field])) {
                    throw new Error('Invalid Rh factor. Must be positive or negative');
                }
                continue;
            }
            if (typeof testResults[field] !== 'boolean') {
                throw new Error(`${field} must be a boolean value`);
            }
        }

        // Calculate isSafe based on test results
        const isSafe = !(
            testResults.hiv ||
            testResults.hepatitisB ||
            testResults.hepatitisC ||
            testResults.syphilis ||
            testResults.malaria ||
            testResults.pathogens
        );

        return {
            ...testResults,
            isSafe,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Upload test results to IPFS
     * @param {Object} testResults - The test results data
     * @returns {Promise<string>} - Returns the IPFS CID
     */
    async uploadTestResults(testResults) {
        try {
            const validatedResults = this.validateTestResults(testResults);
            const resultBuffer = Buffer.from(JSON.stringify(validatedResults));
            const result = await this.ipfs.add(resultBuffer);
            return result.path; // This is the CID
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw error;
        }
    }

    /**
     * Retrieve test results from IPFS
     * @param {string} cid - The IPFS CID of the test results
     * @returns {Promise<Object>} - Returns the test results data
     */
    async getTestResults(cid) {
        try {
            const chunks = [];
            for await (const chunk of this.ipfs.cat(cid)) {
                chunks.push(chunk);
            }
            const resultBuffer = Buffer.concat(chunks);
            return JSON.parse(resultBuffer.toString());
        } catch (error) {
            console.error('Error retrieving from IPFS:', error);
            throw error;
        }
    }

    /**
     * Pin content to ensure persistence
     * @param {string} cid - The IPFS CID to pin
     */
    async pinContent(cid) {
        try {
            await this.ipfs.pin.add(cid);
        } catch (error) {
            console.error('Error pinning content:', error);
            throw error;
        }
    }

    /**
     * Upload a file to IPFS
     * @param {File} file - The file to upload
     * @returns {Promise<string>} - The IPFS hash of the uploaded file
     */
    async uploadFile(file) {
        try {
            const { cid } = await this.ipfs.add(file);
            return cid.toString();
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
}

export default IPFSHandler;
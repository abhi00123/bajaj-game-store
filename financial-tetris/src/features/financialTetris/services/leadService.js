/**
 * Service to handle lead generation and game data submission.
 */
export const leadService = {
    /**
     * Submits user lead information along with game statistics.
     * @param {Object} userData - User details (name, phone, preferred appointment time)
     * @param {Object} gameData - Statistics from the session (score, lines, etc.)
     * @returns {Promise<Object>} - Response from the server
     */
    submitLead: async (userData, gameData) => {
        // Generate a unique identifier for this session
        const gameId = crypto.randomUUID();

        const payload = {
            gameId,
            ...userData,
            timeSurvived: gameData.timeSurvived,
            linesCompleted: gameData.linesCleared,
            score: gameData.score,
            timestamp: new Date().toISOString(),
            source: 'financial-tetris'
        };

        console.log('Submitting lead data:', payload);

        try {
            // Simulation of an API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        message: 'Appointment scheduled successfully',
                        leadId: Math.floor(Math.random() * 100000)
                    });
                }, 1500);
            });

            /* Real implementation example:
            const response = await fetch('YOUR_API_ENDPOINT', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to submit lead');
            return await response.json();
            */
        } catch (error) {
            console.error('Lead submission error:', error);
            throw error;
        }
    }
};

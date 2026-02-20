import axiosInstance from '../../../services/axiosInstance.js';

/**
 * Submit lead capture form data.
 * @param {{ fullName: string, mobile: string, preferredDate: string, preferredTime: string }} data
 * @returns {Promise<{ success: boolean }>}
 */
export async function submitLead(data) {
    const response = await axiosInstance.post('/leads/submit', {
        fullName: data.fullName,
        mobile: data.mobile,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        source: 'retirement-sudoku',
        timestamp: new Date().toISOString(),
    });
    return response.data;
}

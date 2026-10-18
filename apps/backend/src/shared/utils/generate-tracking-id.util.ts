/**
 * Generates an enterprise-standard tracking identifier sequence.
 * Format output layout sequence: LSX-[YYYYMMDD]-[RANDOM_ENTROPY]
 */
export const generateTrackingId = (): string => {
    const dateBlock = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomEntropy = Math.floor(100000 + Math.random() * 900000);
    return `LSX-${dateBlock}-${randomEntropy}`;
};

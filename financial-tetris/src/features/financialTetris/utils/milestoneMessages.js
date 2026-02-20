export const MILESTONE_MESSAGES = [
    "You secured your short-term financial needs.",
    "You strengthened your long-term savings.",
    "You built protection for health and emergencies.",
    "You secured financial protection for your loved ones.",
    "Your financial foundation is getting stronger."
];

export const getRandomMilestone = () =>
    MILESTONE_MESSAGES[Math.floor(Math.random() * MILESTONE_MESSAGES.length)];

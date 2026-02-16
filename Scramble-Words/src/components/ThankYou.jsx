import { motion } from "framer-motion";

export default function ThankYou({ onHome, firstName }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 game-bg-gradient font-sans"
        >
            <div className="space-y-6">
                {/* Large Heading */}
                <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-widest leading-tight uppercase">
                    THANK YOU!
                </h1>

                {/* Optional First Name */}
                {firstName && (
                    <h2 className="text-3xl sm:text-4xl font-bold text-white/90 uppercase tracking-wider">
                        {firstName}
                    </h2>
                )}

                {/* Thin Subtle Divider Line */}
                <div className="h-px w-24 bg-white/30 mx-auto my-6"></div>

                {/* Two Lines of Text */}
                <div className="space-y-2">
                    <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide">
                        Thank you for sharing your details.
                    </p>
                    <p className="text-white/80 text-base sm:text-lg font-normal tracking-wide">
                        Our Relationship Manager will reach out to you shortly.
                    </p>
                </div>
            </div>

            {/* Optional: Add a subtle way to return home if the user gets stuck, 
                though the requirement said "No CTA button". 
                I will omit it to strictly follow "No CTA button". 
                If needed, it can be added back. 
            */}
        </motion.div>
    );
}

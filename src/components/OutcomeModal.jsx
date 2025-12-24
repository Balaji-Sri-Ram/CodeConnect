
import React from "react";
import "./coin.css";
import coinImage from "../assets/reward-coin.png";
import { X, CheckCircle2 } from "lucide-react";

const OutcomeModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const { type, coinsEarned } = data; // type: 'problem' | 'challenge'

    // Title logic
    const title = type === 'challenge'
        ? "Company Challenge Completed!"
        : "Practice Problem Completed!";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            {/* Modal Card 
          Light Mode: bg-white, text-black
          Dark Mode: bg-[#282828], text-[#eff1f6eb] (as requested)
      */}
            <div
                className="relative w-[90vw] sm:max-w-[480px] bg-white dark:bg-[#282828] text-black dark:text-[#eff1f6eb] rounded-xl shadow-2xl animate-modal-float overflow-hidden flex flex-col items-center"
                style={{ padding: "24px" }}
            >

                {/* Close Button - top right */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header: Green Check + Title - Aligned LEFT */}
                <div className="flex items-center gap-2 mb-6 w-full justify-start">
                    <CheckCircle2 className="w-5 h-5 text-[#2cbb5d] fill-[#2cbb5d] text-white shrink-0" />
                    <span className="text-md font-semibold dark:text-white leading-tight">{title}</span>
                </div>

                {/* Coins Earned Section */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold dark:text-white">
                            Coins Earned:
                        </span>
                        <span className="text-xl font-bold text-yellow-500 dark:text-yellow-400">
                            {coinsEarned}
                        </span>
                    </div>
                </div>

                {/* Motivational Text */}
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-6 text-center">
                    Consistency is key, Keep practicing and solve more problems
                </p>

                {/* Rotating Coin with "Thickness" via 3D Layering */}
                <div className="relative w-32 h-32 my-2" style={{ perspective: "1000px" }}>
                    <div className="coin-3d-container">
                        {/* 
                   Create multiple layers to simulate 3D thickness (extrusion). 
                */}
                        {[...Array(12)].map((_, index) => (
                            <img
                                key={index}
                                src={coinImage}
                                alt="Reward Coin"
                                className="coin-layer drop-shadow-sm"
                                style={{
                                    transform: `translateZ(-${index}px)`,
                                    pointerEvents: 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OutcomeModal;

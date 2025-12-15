'use client';
import React from 'react';
import sadBonkie from '../assets/bonkie_sad.png';
import happyBonkie from '../assets/bonkie_happy.png';
import neutralBonkie from '../assets/bonkie_neutral.png';
import cryingBonkie from '../assets/bonkie_crying.png';

const Character = ({ mood }) => {
    let imageSrc = neutralBonkie;

    if (mood <= 20) {
        imageSrc = cryingBonkie;
    } else if (mood <= 40) {
        imageSrc = sadBonkie;
    } else if (mood >= 80) {
        imageSrc = happyBonkie;
    } else {
        imageSrc = neutralBonkie;
    }

    return (
        <div className="character-container">
            <img
                src={imageSrc}
                alt="Bonkie"
                className="bonkie-image"
                style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'contain',
                    transition: 'all 0.5s ease-in-out',
                    filter: mood < 30 ? 'grayscale(0.2)' : 'none',
                    transform: mood > 80 ? 'bounce(1s infinite)' : 'none' // Simple CSS animation placeholder
                }}
            />
        </div>
    );
};

export default Character;

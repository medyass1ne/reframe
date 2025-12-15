'use client';
import React from 'react';

const Choices = ({ choices, onChoose }) => {
    return (
        <div className="choices-container">
            {choices.map((choice, index) => (
                <button
                    key={index}
                    className="choice-btn"
                    onClick={() => onChoose(choice)}
                >
                    {choice.text}
                </button>
            ))}
        </div>
    );
};

export default Choices;

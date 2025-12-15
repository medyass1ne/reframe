'use client';
import React, { useState, useEffect } from 'react';
import { scenarios, getRandomIntro } from './scenarios';
/* import happyBg from './assets/bonkie_happy_bg.png';
import sadBg from './assets/bonkie_sad_bg.png';
import cryingBg from './assets/bonkie_crying_bg.png';
import panicBg from './assets/bonkie_panic.jpg';
import calmBg from './assets/bonkie_calm.jpg';
import exhaustedBg from './assets/bonkie_exhausted.jpg';
import sleepingBg from './assets/bonkie_sleeping.jpg';
import overwhelmedBg from './assets/bonkie_overwhelmed.jpg'; */

// Image Mapping
const imageMap = {
    panic: "/bonkie/bonkie_panic.jpg",
    calm: "/bonkie/bonkie_calm.jpg",
    exhausted: "/bonkie/bonkie_exhausted.jpg",
    sleeping: "/bonkie/bonkie_sleeping.jpg",
    overwhelmed: "/bonkie/bonkie_overwhelmed.jpg",
};

function App() {
    // Initialize with a random scenario
    const [currentScenarioId, setCurrentScenarioId] = useState(() => getRandomIntro());

    const [mood, setMood] = useState(20);
    const [trust, setTrust] = useState(30);
    const [energy, setEnergy] = useState(50);
    const [gameState, setGameState] = useState('playing');

    const currentScenario = scenarios.find(s => s.id === currentScenarioId);

    // SAFETY CHECK
    useEffect(() => {
        if (gameState === 'playing' && !currentScenario) {
            console.error(`Scenario not found: ${currentScenarioId}`);
            setGameState('lost');
        }
    }, [currentScenarioId, gameState, currentScenario]);

    const handleChoice = (choice) => {
        const newMood = Math.min(100, Math.max(0, mood + (choice.moodEffect || 0)));
        const newTrust = Math.min(100, Math.max(0, trust + (choice.trustEffect || 0)));
        const newEnergy = Math.min(100, Math.max(0, energy + (choice.energyEffect || 0)));

        setMood(newMood);
        setTrust(newTrust);
        setEnergy(newEnergy);

        // Critical State Check (Redemption)
        if (gameState === 'playing' && (newMood <= 10 || newTrust <= 10) && currentScenarioId !== 'redemption') {
            setCurrentScenarioId('redemption');
            return;
        }

        if (newMood <= 0 || newTrust <= 0) {
            setGameState('lost');
        } else if (newMood >= 90 && newTrust >= 80) {
            setGameState('won');
        } else {
            if (choice.nextScenarioId) {
                if (choice.nextScenarioId === 'intro') {
                    setCurrentScenarioId(getRandomIntro());
                } else {
                    setCurrentScenarioId(choice.nextScenarioId);
                }
            } else if (newMood >= 90) {
                setGameState('won');
            } else {
                // End of line (Win)
                setGameState('won');
            }
        }
    };

    const resetGame = () => {
        setMood(20);
        setTrust(30);
        setEnergy(50);
        setCurrentScenarioId(getRandomIntro());
        setGameState('playing');
    };

    // Determine background image
    let bgImage = "/bonkie/bonkie_happy_bg.png";
    if (currentScenario && currentScenario.image && imageMap[currentScenario.image]) {
        bgImage = imageMap[currentScenario.image];
    } else {
        if (mood <= 30) {
            bgImage = "/bonkie/bonkie_crying_bg.png";
        } else if (mood <= 60) {
            bgImage = "/bonkie/bonkie_sad_bg.png";
        }
    }

    // Get Reflection Text
    const getReflection = () => {
        if (currentScenario && currentScenario.reflection) {
            return currentScenario.reflection;
        }
        if (gameState === 'won') return "You helped Bonkie find his smile again. Remember to be kind to yourself, too.";
        if (gameState === 'lost') return "Bonkie needs some space right now. It's okay to try again.";
        return "";
    };

    return (
        <div className="app-container">

            {/* Top Bar: Scenario Text */}
            <div className="top-bar">
                <div className="scenario-text">
                    {gameState === 'playing' && currentScenario ? currentScenario.text :
                        gameState === 'won' ? "Bonkie feels safe and loved. You did a wonderful job." :
                            gameState === 'lost' ? "Bonkie has shut down... He doesn't trust you right now." :
                                "Something went wrong. Please try again."}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stat-item">
                    <span className="stat-label">Mood</span>
                    <div className="progress-bg">
                        <div className="progress-fill mood-fill" style={{ width: `${mood}%` }}></div>
                    </div>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Trust</span>
                    <div className="progress-bg">
                        <div className="progress-fill trust-fill" style={{ width: `${trust}%` }}></div>
                    </div>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Energy</span>
                    <div className="progress-bg">
                        <div className="progress-fill energy-fill" style={{ width: `${energy}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <div className="image-wrapper">
                    <img src={bgImage} alt="Bonkie Scene" className="scene-image" />

                    {/* Floating Choices / Reflection */}
                    <div className="floating-choices">

                        {/* Reflection Box (Win/Loss/End) */}
                        {(gameState !== 'playing' || (currentScenario && currentScenario.reflection)) && (
                            <div className="reflection-box">
                                <p>{getReflection()}</p>
                            </div>
                        )}

                        {gameState === 'playing' && currentScenario && (
                            <div className="choices-list">
                                {currentScenario.choices.map((choice, index) => (
                                    <button
                                        key={index}
                                        className="choice-btn"
                                        onClick={() => handleChoice(choice)}
                                    >
                                        {choice.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {(gameState !== 'playing' || !currentScenario) && (
                            <div className="choices-list">
                                <button onClick={resetGame} className="choice-btn reset-btn" style={{ display: 'block', width: '100%' }}>
                                    {gameState === 'won' ? 'Play Again' : 'Try Again'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;

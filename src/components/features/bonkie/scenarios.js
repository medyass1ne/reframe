// Helper to get a random starting scenario
export const getRandomIntro = () => {
    const intros = ['panic_intro', 'fatigue_intro', 'stress_intro', 'depression_intro'];
    return intros[Math.floor(Math.random() * intros.length)];
};

export const scenarios = [
    // --- ARC 1: DEPRESSION (The Heavy Blanket) ---
    {
        id: 'depression_intro',
        text: "Bonkie is curled up under a heavy blanket. The world feels too loud and too bright for him right now. He's hiding.",
        choices: [
            { text: "Whisper that you're here", moodEffect: 5, trustEffect: 10, energyEffect: 0, nextScenarioId: 'dep_whisper' },
            { text: "Pull the blanket off (Force him)", moodEffect: -20, trustEffect: -30, energyEffect: -10, nextScenarioId: 'dep_forced_open' },
            { text: "Sit quietly nearby", moodEffect: 0, trustEffect: 15, energyEffect: 5, nextScenarioId: 'dep_waiting_game' },
        ],
    },
    {
        id: 'dep_whisper',
        text: "He hears you. The blanket shifts slightly. Knowing he isn't alone makes the darkness a little less scary.",
        choices: [
            { text: "Offer a gentle smile", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'dep_emerging' },
            { text: "Ask 'Why are you sad?'", moodEffect: -5, trustEffect: 0, energyEffect: -5, nextScenarioId: 'dep_too_soon' },
        ],
    },
    {
        id: 'dep_too_soon',
        text: "He shrinks back. He doesn't know why he's sad, and asking makes him feel guilty for not having an answer.",
        choices: [
            { text: "Say 'It's okay not to know'", moodEffect: 10, trustEffect: 15, energyEffect: 5, nextScenarioId: 'dep_emerging' },
            { text: "Leave him be", moodEffect: -5, trustEffect: -5, energyEffect: 0, nextScenarioId: 'depression_intro' },
        ],
    },
    {
        id: 'dep_forced_open',
        text: "Bonkie scrambles away, terrified! Forcing him into the light before he was ready only made him feel more exposed.",
        choices: [
            { text: "Apologize sincerely", moodEffect: 5, trustEffect: 10, energyEffect: -5, nextScenarioId: 'dep_apology_corner' },
            { text: "Insist he needs fresh air", moodEffect: -30, trustEffect: -50, energyEffect: -20, nextScenarioId: 'shutdown' },
        ],
    },
    {
        id: 'dep_apology_corner',
        text: "He sees your regret. He nods slowly, accepting the apology, but he needs time to trust again.",
        choices: [
            { text: "Give him space", moodEffect: 5, trustEffect: 10, energyEffect: 5, nextScenarioId: 'dep_waiting_game' },
        ],
    },
    {
        id: 'dep_waiting_game',
        text: "You sit in silence. It's a comfortable silence. He realizes he doesn't have to 'perform' happiness for you.",
        choices: [
            { text: "Hum a soothing tune", moodEffect: 15, trustEffect: 20, energyEffect: 10, nextScenarioId: 'dep_humming_peace' },
            { text: "Place a cookie within reach", moodEffect: 10, trustEffect: 5, energyEffect: 15, nextScenarioId: 'dep_cookie_interest' },
        ],
    },
    {
        id: 'dep_emerging',
        text: "Bonkie peeks out. He looks tired, but the weight on his shoulders seems a tiny bit lighter.",
        choices: [
            { text: "Offer a gentle pat", moodEffect: 15, trustEffect: 15, energyEffect: 5, nextScenarioId: 'dep_bonding' },
            { text: "Tell him to go wash his face", moodEffect: -10, trustEffect: -5, energyEffect: -10, nextScenarioId: 'dep_refusal' },
        ],
    },
    {
        id: 'dep_refusal',
        text: "He shakes his head. That feels like too much work right now.",
        choices: [
            { text: "Say 'That's okay, maybe later'", moodEffect: 5, trustEffect: 10, energyEffect: 0, nextScenarioId: 'dep_bonding' },
        ],
    },
    {
        id: 'dep_humming_peace',
        text: "The melody fills the room. It's a reminder that there is still beauty in the world, even when it feels gray.",
        choices: [
            { text: "Keep humming", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'dep_bonding' },
        ],
    },
    {
        id: 'dep_cookie_interest',
        text: "Crunch. He eats the cookie. Sometimes, self-care starts with just one small bite.",
        choices: [
            { text: "Smile without pressure", moodEffect: 10, trustEffect: 10, energyEffect: 10, nextScenarioId: 'dep_bonding' },
        ],
    },
    {
        id: 'dep_bonding',
        text: "Bonkie leans against you. He's not 'fixed', but he's connected. And connection is the opposite of depression.",
        choices: [
            { text: "Share a quiet moment", moodEffect: 15, trustEffect: 25, energyEffect: 5, nextScenarioId: 'dep_deep_trust' },
        ],
    },
    {
        id: 'dep_deep_trust',
        text: "He falls asleep, safe and sound. You've taught him that he's worthy of love, even when he's sad.",
        reflection: "By being patient with Bonkie's sadness, you learn that your own sadness deserves patience too. You don't have to 'fix' yourself instantly.",
        choices: [
            { text: "Let him rest (Finish)", moodEffect: 100, trustEffect: 100, energyEffect: 100, nextScenarioId: null },
        ],
    },

    // --- ARC 2: PANIC DISORDER (The Storm) ---
    {
        id: 'panic_intro',
        image: 'panic',
        text: "Bonkie is pacing. His heart is racing like a drum. He feels like something terrible is about to happen, but he doesn't know what.",
        choices: [
            { text: "Grab him to stop him", moodEffect: -20, trustEffect: -20, energyEffect: -10, nextScenarioId: 'panic_worse' },
            { text: "Speak in a low, steady voice", moodEffect: 5, trustEffect: 10, energyEffect: 0, nextScenarioId: 'panic_grounding' },
            { text: "Ask 'What are you scared of?'", moodEffect: -10, trustEffect: 0, energyEffect: -5, nextScenarioId: 'panic_confusion' },
        ],
    },
    {
        id: 'panic_worse',
        image: 'panic',
        text: "He flinches! Physical restriction makes the panic worse. He feels trapped.",
        choices: [
            { text: "Step back and show open hands", moodEffect: 5, trustEffect: 5, energyEffect: 0, nextScenarioId: 'panic_grounding' },
            { text: "Yell 'Calm down!'", moodEffect: -50, trustEffect: -50, energyEffect: -30, nextScenarioId: 'shutdown' },
        ],
    },
    {
        id: 'panic_grounding',
        image: 'calm',
        text: "He pauses. Your calm voice is an anchor in his storm. He looks at you, pleading for help.",
        choices: [
            { text: "Breathe with him (In... Out...)", moodEffect: 15, trustEffect: 20, energyEffect: 5, nextScenarioId: 'panic_breathing' },
            { text: "Offer water", moodEffect: 5, trustEffect: 10, energyEffect: 5, nextScenarioId: 'panic_water' },
        ],
    },
    {
        id: 'panic_water',
        image: 'calm',
        text: "He takes a sip. The sensation of cool water helps ground him in the present moment.",
        choices: [
            { text: "Ask him to name 3 things he sees", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'panic_54321' },
        ],
    },
    {
        id: 'panic_confusion',
        image: 'panic',
        text: "He tries to answer, but he can't. Panic often has no logic. Asking 'why' just adds confusion to the fear.",
        choices: [
            { text: "Say 'It doesn't matter why, I'm here'", moodEffect: 10, trustEffect: 15, energyEffect: 5, nextScenarioId: 'panic_grounding' },
        ],
    },
    {
        id: 'panic_breathing',
        image: 'calm',
        text: "In... Out... Bonkie mimics your breathing. His shaking begins to subside as his nervous system cools down.",
        choices: [
            { text: "Name 5 things you can see", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'panic_54321' },
        ],
    },
    {
        id: 'panic_54321',
        image: 'calm',
        text: "He points to the lamp, the rug, his toes... He is returning to his body. The storm is passing.",
        choices: [
            { text: "Praise his bravery", moodEffect: 20, trustEffect: 20, energyEffect: 10, nextScenarioId: 'panic_resolved' },
        ],
    },
    {
        id: 'panic_resolved',
        image: 'calm',
        text: "Bonkie looks exhausted, but the terror is gone. He survived the wave.",
        reflection: "You helped Bonkie ride out the storm without judgment. Remember: Anxiety is not a weakness, and you are strong enough to weather your own storms.",
        choices: [
            { text: "Wrap him in a warm blanket (Finish)", moodEffect: 100, trustEffect: 100, energyEffect: 50, nextScenarioId: null },
        ],
    },

    // --- ARC 3: FATIGUE / BURNOUT (The Empty Battery) ---
    {
        id: 'fatigue_intro',
        image: 'exhausted',
        text: "Bonkie is lying face down on the floor. He's not sad, he's just... empty. He has nothing left to give.",
        choices: [
            { text: "Poke him to be productive", moodEffect: -10, trustEffect: -5, energyEffect: -20, nextScenarioId: 'fatigue_annoyed' },
            { text: "Lie down next to him", moodEffect: 10, trustEffect: 15, energyEffect: 5, nextScenarioId: 'fatigue_solidarity' },
            { text: "Play loud music", moodEffect: -30, trustEffect: -20, energyEffect: -30, nextScenarioId: 'shutdown' },
        ],
    },
    {
        id: 'fatigue_annoyed',
        image: 'exhausted',
        text: "He groans. He knows he 'should' be doing things, but the pressure just makes him heavier.",
        choices: [
            { text: "Stop pushing and apologize", moodEffect: 5, trustEffect: 5, energyEffect: 0, nextScenarioId: 'fatigue_solidarity' },
        ],
    },
    {
        id: 'fatigue_solidarity',
        image: 'exhausted',
        text: "You lie on the floor too. No demands. No expectations. Just existing. He relaxes knowing he doesn't have to perform.",
        choices: [
            { text: "Whisper 'Rest is productive too'", moodEffect: 15, trustEffect: 20, energyEffect: 10, nextScenarioId: 'fatigue_acceptance' },
            { text: "Start planning tomorrow", moodEffect: -15, trustEffect: -10, energyEffect: -10, nextScenarioId: 'fatigue_stress' },
        ],
    },
    {
        id: 'fatigue_stress',
        image: 'overwhelmed',
        text: "The mention of plans makes him tense up again. His battery is at 0%.",
        choices: [
            { text: "Back off: 'Tomorrow can wait'", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'fatigue_acceptance' },
        ],
    },
    {
        id: 'fatigue_acceptance',
        image: 'exhausted',
        text: "A tear rolls down his cheek. He felt guilty for stopping, but you gave him permission to just be.",
        choices: [
            { text: "Offer warm tea", moodEffect: 10, trustEffect: 10, energyEffect: 15, nextScenarioId: 'fatigue_tea' },
            { text: "Suggest a nap", moodEffect: 10, trustEffect: 10, energyEffect: 20, nextScenarioId: 'fatigue_nap' },
        ],
    },
    {
        id: 'fatigue_tea',
        image: 'sleeping',
        text: "He sips the tea. Warmth spreads through his chest. It's a small recharge.",
        choices: [
            { text: "Tuck him in", moodEffect: 10, trustEffect: 10, energyEffect: 10, nextScenarioId: 'fatigue_nap' },
        ],
    },
    {
        id: 'fatigue_nap',
        image: 'sleeping',
        text: "He nods weakly and closes his eyes. He sleeps deeply, finally recharging.",
        reflection: "You validated Bonkie's need for rest. In a world that demands constant output, remember that resting is not quitting—it's how you survive.",
        choices: [
            { text: "Let him sleep (Finish)", moodEffect: 100, trustEffect: 100, energyEffect: 100, nextScenarioId: null },
        ],
    },

    // --- ARC 4: STRESS / OVERWHELM (The Messy Room) ---
    {
        id: 'stress_intro',
        image: 'overwhelmed',
        text: "Bonkie is surrounded by clutter. He's trying to organize, but he keeps dropping things. He looks ready to explode.",
        choices: [
            { text: "Start cleaning for him", moodEffect: 5, trustEffect: 5, energyEffect: 5, nextScenarioId: 'stress_help' },
            { text: "Tell him to stop and breathe", moodEffect: 0, trustEffect: 0, energyEffect: 0, nextScenarioId: 'stress_pause' },
            { text: "Ask 'Why is this so messy?'", moodEffect: -20, trustEffect: -20, energyEffect: -10, nextScenarioId: 'stress_shame' },
        ],
    },
    {
        id: 'stress_shame',
        image: 'overwhelmed',
        text: "He hangs his head. He knows it's a mess. Pointing it out just adds shame to the stress.",
        choices: [
            { text: "Say 'It's okay, messes happen'", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'stress_pause' },
        ],
    },
    {
        id: 'stress_help',
        image: 'overwhelmed',
        text: "You pick up a few things. He tries to stop you, saying 'I have to do it!', but he looks relieved.",
        choices: [
            { text: "Say 'We can do it together'", moodEffect: 15, trustEffect: 20, energyEffect: 10, nextScenarioId: 'stress_teamwork' },
            { text: "Take over completely", moodEffect: -5, trustEffect: -5, energyEffect: 5, nextScenarioId: 'stress_useless' },
        ],
    },
    {
        id: 'stress_useless',
        image: 'exhausted',
        text: "He sits down, feeling useless. You fixed the mess, but you didn't fix the feeling.",
        choices: [
            { text: "Ask him to help with the last bit", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'stress_teamwork' },
        ],
    },
    {
        id: 'stress_pause',
        image: 'calm',
        text: "He stops. He takes a breath. The mess is still there, but the panic about the mess recedes.",
        choices: [
            { text: "Pick up just one thing", moodEffect: 10, trustEffect: 10, energyEffect: 5, nextScenarioId: 'stress_teamwork' },
        ],
    },
    {
        id: 'stress_teamwork',
        image: 'overwhelmed',
        text: "You tackle one pile at a time. Slowly, the floor becomes visible again. It wasn't impossible after all.",
        reflection: "You showed Bonkie that big problems are just small problems stacked together. Be gentle with yourself when you feel overwhelmed; just move one stone at a time.",
        choices: [
            { text: "High five! (Finish)", moodEffect: 100, trustEffect: 100, energyEffect: 50, nextScenarioId: null },
        ],
    },

    // --- SHARED ENDINGS / FAIL STATES ---
    {
        id: 'shutdown',
        text: "Bonkie has shut down. He feels unsafe and misunderstood. He needs space.",
        reflection: "Sometimes we push too hard because we want to help. It's okay to step back and try again with more gentleness.",
        choices: [
            { text: "Try Again", moodEffect: 0, trustEffect: 0, energyEffect: 0, nextScenarioId: 'intro' },
        ],
    },
    {
        id: 'redemption',
        text: "Bonkie is turning away. He's losing hope. This is your last chance to show him he matters.",
        choices: [
            { text: "Apologize and just listen", moodEffect: 20, trustEffect: 20, energyEffect: 0, nextScenarioId: 'intro' },
            { text: "Give him his comfort object", moodEffect: 15, trustEffect: 10, energyEffect: 5, nextScenarioId: 'dep_emerging' },
            { text: "Do nothing", moodEffect: -100, trustEffect: -100, energyEffect: -100, nextScenarioId: null },
        ],
    },
];

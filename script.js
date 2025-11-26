// script.js

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize games
    initMathGame();
    initMemoryGame();
    initPatternGame();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize progress chart
    initProgressChart();
}

// Event Listeners
function setupEventListeners() {
    // Start learning button
    document.getElementById('start-learning').addEventListener('click', function() {
        document.getElementById('activities').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Activity cards
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.closest('.activity-card').dataset.category;
            activateGameTab(category);
            document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Game tabs
    const gameTabs = document.querySelectorAll('.game-tab');
    gameTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const game = this.dataset.game;
            activateGameTab(game);
        });
    });
}

// Game Tab Activation
function activateGameTab(game) {
    // Update active tab
    document.querySelectorAll('.game-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.game-tab[data-game="${game}"]`).classList.add('active');
    
    // Show active game
    document.querySelectorAll('.game-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${game}-game`).classList.add('active');
    
    // Reset and initialize the selected game
    if (game === 'math') {
        resetMathGame();
    } else if (game === 'memory') {
        resetMemoryGame();
    } else if (game === 'pattern') {
        resetPatternGame();
    }
}

// Math Game
let mathScore = 0;
let currentMathProblem = {};

function initMathGame() {
    generateMathProblem();
    
    // Add event listeners to answer buttons
    const answerButtons = document.querySelectorAll('#math-game .answer-btn');
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkMathAnswer(parseInt(this.textContent));
        });
    });
}

function generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = '+';
    
    currentMathProblem = {
        num1: num1,
        num2: num2,
        operation: operation,
        answer: num1 + num2
    };
    
    document.getElementById('math-problem').textContent = `${num1} ${operation} ${num2} = ?`;
    
    // Generate answer options
    const options = generateAnswerOptions(currentMathProblem.answer);
    const answerButtons = document.querySelectorAll('#math-game .answer-btn');
    
    answerButtons.forEach((button, index) => {
        button.textContent = options[index];
    });
}

function generateAnswerOptions(correctAnswer) {
    const options = [correctAnswer];
    
    // Generate 3 wrong answers
    while (options.length < 4) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 5) - 2;
        if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // Shuffle the options
    return shuffleArray(options);
}

function checkMathAnswer(selectedAnswer) {
    if (selectedAnswer === currentMathProblem.answer) {
        mathScore++;
        document.getElementById('math-score').textContent = mathScore;
        updateProgress('correct');
        
        // Visual feedback for correct answer
        const buttons = document.querySelectorAll('#math-game .answer-btn');
        buttons.forEach(button => {
            if (parseInt(button.textContent) === currentMathProblem.answer) {
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
            }
        });
        
        // Generate new problem after a delay
        setTimeout(() => {
            generateMathProblem();
            resetButtonColors();
        }, 1500);
    } else {
        // Visual feedback for wrong answer
        const buttons = document.querySelectorAll('#math-game .answer-btn');
        buttons.forEach(button => {
            if (parseInt(button.textContent) === selectedAnswer) {
                button.style.backgroundColor = '#F44336';
                button.style.color = 'white';
            }
            if (parseInt(button.textContent) === currentMathProblem.answer) {
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
            }
        });
        
        // Generate new problem after a delay
        setTimeout(() => {
            generateMathProblem();
            resetButtonColors();
        }, 1500);
    }
    
    updateProgress('activity');
}

function resetButtonColors() {
    const buttons = document.querySelectorAll('#math-game .answer-btn');
    buttons.forEach(button => {
        button.style.backgroundColor = '#e9f5ff';
        button.style.color = '#2575fc';
    });
}

function resetMathGame() {
    mathScore = 0;
    document.getElementById('math-score').textContent = mathScore;
    generateMathProblem();
}

// Memory Game
let memoryCards = [];
let flippedCards = [];
let memoryMatches = 0;
let memoryScore = 0;

function initMemoryGame() {
    createMemoryBoard();
}

function createMemoryBoard() {
    const memoryBoard = document.querySelector('.memory-board');
    memoryBoard.innerHTML = '';
    
    // Create card pairs
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🥝', '🍉'];
    memoryCards = [...symbols, ...symbols];
    memoryCards = shuffleArray(memoryCards);
    
    // Create card elements
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.textContent = '?';
        
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
    });
}

function flipCard() {
    // Don't allow flipping if already flipped or matched
    if (this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    // Don't allow flipping more than 2 cards
    if (flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);
    
    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryMatches++;
        memoryScore++;
        document.getElementById('memory-score').textContent = memoryMatches;
        
        updateProgress('correct');
        
        // Check if all matches found
        if (memoryMatches === 8) {
            setTimeout(() => {
                alert('Congratulations! You found all matches!');
                resetMemoryGame();
            }, 500);
        }
    } else {
        // No match - flip cards back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
    }
    
    flippedCards = [];
    updateProgress('activity');
}

function resetMemoryGame() {
    memoryMatches = 0;
    memoryScore = 0;
    document.getElementById('memory-score').textContent = memoryMatches;
    flippedCards = [];
    createMemoryBoard();
}

// Pattern Game
let patternSequence = [];
let patternOptions = [];
let patternScore = 0;

function initPatternGame() {
    generatePattern();
}

function generatePattern() {
    const patternDisplay = document.querySelector('.pattern-display');
    const patternOptionsContainer = document.querySelector('.pattern-options');
    
    // Clear previous pattern
    patternDisplay.innerHTML = '';
    patternOptionsContainer.innerHTML = '';
    patternSequence = [];
    
    // Generate pattern (3-5 items)
    const patternLength = Math.floor(Math.random() * 3) + 3;
    const symbols = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
    
    for (let i = 0; i < patternLength; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        patternSequence.push(symbol);
        
        const patternItem = document.createElement('div');
        patternItem.className = 'pattern-item';
        patternItem.style.backgroundColor = getColorForSymbol(symbol);
        patternItem.textContent = symbol;
        patternDisplay.appendChild(patternItem);
    }
    
    // Generate options (include the next item in pattern)
    const nextSymbol = getNextPatternSymbol();
    patternOptions = [nextSymbol];
    
    // Add 3 random options
    while (patternOptions.length < 4) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        if (!patternOptions.includes(randomSymbol)) {
            patternOptions.push(randomSymbol);
        }
    }
    
    // Shuffle options
    patternOptions = shuffleArray(patternOptions);
    
    // Create option buttons
    patternOptions.forEach(symbol => {
        const option = document.createElement('div');
        option.className = 'pattern-option';
        option.style.backgroundColor = getColorForSymbol(symbol);
        option.textContent = symbol;
        
        option.addEventListener('click', function() {
            checkPatternAnswer(symbol);
        });
        
        patternOptionsContainer.appendChild(option);
    });
}

function getNextPatternSymbol() {
    // Simple pattern: alternating colors
    const lastSymbol = patternSequence[patternSequence.length - 1];
    const symbols = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
    
    // For a simple pattern, just pick a random different symbol
    let nextSymbol;
    do {
        nextSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    } while (nextSymbol === lastSymbol && symbols.length > 1);
    
    return nextSymbol;
}

function getColorForSymbol(symbol) {
    const colorMap = {
        '🔴': '#FF6B6B',
        '🔵': '#4ECDC4',
        '🟢': '#6BCF7F',
        '🟡': '#FFD166',
        '🟣': '#9B5DE5',
        '🟠': '#F8961E'
    };
    
    return colorMap[symbol] || '#E9F5FF';
}

function checkPatternAnswer(selectedSymbol) {
    const correctSymbol = getNextPatternSymbol();
    
    if (selectedSymbol === correctSymbol) {
        patternScore++;
        document.getElementById('pattern-score').textContent = patternScore;
        updateProgress('correct');
        
        // Visual feedback
        const options = document.querySelectorAll('.pattern-option');
        options.forEach(option => {
            if (option.textContent === selectedSymbol) {
                option.style.border = '3px solid #4CAF50';
            }
        });
    } else {
        // Visual feedback for wrong answer
        const options = document.querySelectorAll('.pattern-option');
        options.forEach(option => {
            if (option.textContent === selectedSymbol) {
                option.style.border = '3px solid #F44336';
            }
            if (option.textContent === correctSymbol) {
                option.style.border = '3px solid #4CAF50';
            }
        });
    }
    
    // Generate new pattern after a delay
    setTimeout(() => {
        generatePattern();
    }, 1500);
    
    updateProgress('activity');
}

function resetPatternGame() {
    patternScore = 0;
    document.getElementById('pattern-score').textContent = patternScore;
    generatePattern();
}

// Progress Tracking
let activitiesCompleted = 0;
let correctAnswers = 0;
let learningStreak = 0;

function updateProgress(type) {
    if (type === 'activity') {
        activitiesCompleted++;
        document.getElementById('activities-completed').textContent = activitiesCompleted;
    } else if (type === 'correct') {
        correctAnswers++;
        document.getElementById('correct-answers').textContent = correctAnswers;
    }
    
    // Update progress chart
    updateProgressChart();
}

function initProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    window.progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Math', 'Memory', 'Patterns'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#6a11cb',
                    '#2575fc',
                    '#ff9a9e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateProgressChart() {
    if (window.progressChart) {
        // Update with actual game scores
        window.progressChart.data.datasets[0].data = [
            mathScore,
            memoryScore,
            patternScore
        ];
        window.progressChart.update();
    }
}

// Utility Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
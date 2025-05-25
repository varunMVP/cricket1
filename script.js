// Game State
let gameState = {
    teams: { team1: '', team2: '' },
    battingTeam: '',
    bowlingTeam: '',
    innings: 1,
    totalOvers: 20,
    playersPerTeam: 11,
    scores: { team1: 0, team2: 0 },
    wickets: { team1: 0, team2: 0 },
    oversCompleted: { team1: 0, team2: 0 },
    ballsInCurrentOver: { team1: 0, team2: 0 },
    currentOver: [],
    batsmen: {
        batsman1: { 
            name: '', 
            runs: 0, 
            balls: 0, 
            fours: 0, 
            sixes: 0, 
            ones: 0, 
            twos: 0, 
            dots: 0, 
            isOut: false,
            saved: false
        },
        batsman2: { 
            name: '', 
            runs: 0, 
            balls: 0, 
            fours: 0, 
            sixes: 0, 
            ones: 0, 
            twos: 0, 
            dots: 0, 
            isOut: false,
            saved: false
        }
    },
    striker: 'batsman1',
    bowler: { name: '', overs: 0, balls: 0, runs: 0, wickets: 0, saved: false },
    players: { team1: [], team2: [] },
    bowlers: { team1: [], team2: [] },
    ballByBall: [],
    matchEnded: false,
    winner: '',
    inningsEnded: false,
    target: 0
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTossOptions();
});

function initializeTossOptions() {
    const team1Input = document.getElementById('team1');
    const team2Input = document.getElementById('team2');
    const tossSelect = document.getElementById('toss-winner');
    
    function updateTossOptions() {
        const team1Name = team1Input.value.trim();
        const team2Name = team2Input.value.trim();
        
        tossSelect.innerHTML = '<option value="">Select toss winner</option>';
        
        if (team1Name) {
            tossSelect.innerHTML += `<option value="team1">${team1Name}</option>`;
        }
        if (team2Name) {
            tossSelect.innerHTML += `<option value="team2">${team2Name}</option>`;
        }
    }

    team1Input.addEventListener('input', updateTossOptions);
    team2Input.addEventListener('input', updateTossOptions);
}

function saveBatsman(batsmanKey) {
    const nameInput = document.getElementById(batsmanKey);
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter batsman name');
        return;
    }

    gameState.batsmen[batsmanKey].name = name;
    gameState.batsmen[batsmanKey].saved = true;
    nameInput.disabled = true;
    
    updateDisplay();
   // alert(`${name} added as ${batsmanKey === 'batsman1' ? 'Batsman 1' : 'Batsman 2'}`);
}

function saveBowler() {
    const nameInput = document.getElementById('bowler');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter bowler name');
        return;
    }

    // Check if bowler already exists
    const bowlingTeamKey = gameState.bowlingTeam;
    const existingBowler = gameState.bowlers[bowlingTeamKey].find(b => b.name === name);
    
    if (existingBowler) {
        // Load existing bowler stats
        gameState.bowler = {
            name: existingBowler.name,
            overs: existingBowler.overs || 0,
            balls: existingBowler.balls || 0,
            runs: existingBowler.runs || 0,
            wickets: existingBowler.wickets || 0,
            saved: true
        };
       // alert(`${name} is continuing to bowl (Previous stats loaded)`);
    } else {
        gameState.bowler = {
            name: name,
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0,
            saved: true
        };
     //   alert(`${name} starts bowling`);
    }

    nameInput.disabled = true;
    updateDisplay();
}

function startMatch() {
    const team1 = document.getElementById('team1').value.trim();
    const team2 = document.getElementById('team2').value.trim();
    const tossWinner = document.getElementById('toss-winner').value;
    const battingChoice = document.getElementById('batting-first').value;
    const overs = parseInt(document.getElementById('overs').value);
    const players = parseInt(document.getElementById('players-per-team').value);

    if (!team1 || !team2 || !tossWinner) {
        alert('Please fill in all required fields');
        return;
    }

    gameState.teams.team1 = team1;
    gameState.teams.team2 = team2;
    gameState.totalOvers = overs;
    gameState.playersPerTeam = players;

    if ((tossWinner === 'team1' && battingChoice === 'bat') || 
        (tossWinner === 'team2' && battingChoice === 'bowl')) {
        gameState.battingTeam = 'team1';
        gameState.bowlingTeam = 'team2';
    } else {
        gameState.battingTeam = 'team2';
        gameState.bowlingTeam = 'team1';
    }

    // Initialize bowlers array for teams
    gameState.bowlers.team1 = [];
    gameState.bowlers.team2 = [];

    document.getElementById('setup-section').classList.add('hidden');
    document.getElementById('match-section').classList.remove('hidden');
    updateDisplay();
}

function addRun(runs) {
    if (gameState.matchEnded || gameState.inningsEnded) return;

    const striker = gameState.striker;
    
    // Check if batsman and bowler are saved
    if (!gameState.batsmen[striker].saved) {
      //  alert(`Please save ${striker === 'batsman1' ? 'Batsman 1' : 'Batsman 2'} name first`);
        return;
    }

    if (!gameState.bowler.saved) {
       // alert('Please save bowler name first');
        return;
    }

    // Update scores
    gameState.scores[gameState.battingTeam] += runs;
    gameState.batsmen[striker].runs += runs;
    gameState.batsmen[striker].balls++;
    gameState.bowler.runs += runs;
    gameState.bowler.balls++;
    gameState.ballsInCurrentOver[gameState.battingTeam]++;

    // Track specific run types
    if (runs === 0) gameState.batsmen[striker].dots++;
    if (runs === 1) gameState.batsmen[striker].ones++;
    if (runs === 2) gameState.batsmen[striker].twos++;
    if (runs === 4) gameState.batsmen[striker].fours++;
    if (runs === 6) gameState.batsmen[striker].sixes++;

    // Add to current over
    gameState.currentOver.push(runs);

    // Record ball by ball
    const totalBalls = gameState.bowler.balls;
    gameState.ballByBall.push({
        over: Math.floor((totalBalls - 1) / 6) + 1,
        ball: ((totalBalls - 1) % 6) + 1,
        batsman: gameState.batsmen[striker].name,
        bowler: gameState.bowler.name,
        runs: runs,
        isWicket: false
    });

    // Change strike on odd runs
    if (runs % 2 === 1) {
        gameState.striker = gameState.striker === 'batsman1' ? 'batsman2' : 'batsman1';
    }

    // Check for over completion
    if (gameState.bowler.balls % 6 === 0) {
        completeOver();
    }

    updateDisplay();
    checkMatchEnd();
}

function addWicket() {
    if (gameState.matchEnded || gameState.inningsEnded) return;

    const striker = gameState.striker;
    
    if (!gameState.batsmen[striker].saved) {
    //    alert(`Please save ${striker === 'batsman1' ? 'Batsman 1' : 'Batsman 2'} name first`);
        return;
    }

    if (!gameState.bowler.saved) {
      //  alert('Please save bowler name first');
        return;
    }

    // Update wickets
    gameState.wickets[gameState.battingTeam]++;
    gameState.batsmen[striker].balls++;
    gameState.batsmen[striker].isOut = true;
    gameState.bowler.wickets++;
    gameState.bowler.balls++;
    gameState.ballsInCurrentOver[gameState.battingTeam]++;

    // Add to current over
    gameState.currentOver.push('W');

    // Record ball by ball
    const totalBalls = gameState.bowler.balls;
    gameState.ballByBall.push({
        over: Math.floor((totalBalls - 1) / 6) + 1,
        ball: ((totalBalls - 1) % 6) + 1,
        batsman: gameState.batsmen[striker].name,
        bowler: gameState.bowler.name,
        runs: 0,
        isWicket: true
    });

    // Add batsman to team roster
    addBatsmanToRoster(striker);

    // Reset batsman for new player
    gameState.batsmen[striker] = { 
        name: '', 
        runs: 0, 
        balls: 0, 
        fours: 0, 
        sixes: 0, 
        ones: 0, 
        twos: 0, 
        dots: 0, 
        isOut: false,
        saved: false
    };
    
    const input = document.getElementById(striker);
    input.value = '';
    input.disabled = false;

    // Check for over completion  
    if (gameState.bowler.balls % 6 === 0) {
        completeOver();
    }

    updateDisplay();
    checkMatchEnd();
}

function addBatsmanToRoster(batsmanKey) {
    const batsman = gameState.batsmen[batsmanKey];
    const battingTeamKey = gameState.battingTeam;
    
    // Add to team players if not already there
    const existingPlayer = gameState.players[battingTeamKey].find(p => p.name === batsman.name);
    if (!existingPlayer) {
        gameState.players[battingTeamKey].push({
            name: batsman.name,
            runs: batsman.runs,
            balls: batsman.balls,
            fours: batsman.fours,
            sixes: batsman.sixes,
            ones: batsman.ones,
            twos: batsman.twos,
            dots: batsman.dots,
            isOut: batsman.isOut,
            strikeRate: batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : 0
        });
    }
}

function completeOver() {
    // Save current bowler stats
    const bowlingTeamKey = gameState.bowlingTeam;
    const existingBowlerIndex = gameState.bowlers[bowlingTeamKey].findIndex(b => b.name === gameState.bowler.name);
    
    const bowlerStats = {
        name: gameState.bowler.name,
        overs: Math.floor(gameState.bowler.balls / 6),
        balls: gameState.bowler.balls % 6,
        runs: gameState.bowler.runs,
        wickets: gameState.bowler.wickets,
        economy: gameState.bowler.balls > 0 ? ((gameState.bowler.runs / (gameState.bowler.balls / 6))).toFixed(2) : 0
    };

    if (existingBowlerIndex >= 0) {
        gameState.bowlers[bowlingTeamKey][existingBowlerIndex] = bowlerStats;
    } else {
        gameState.bowlers[bowlingTeamKey].push(bowlerStats);
    }

    // Update over count
    gameState.oversCompleted[gameState.battingTeam]++;
    gameState.ballsInCurrentOver[gameState.battingTeam] = 0;
    gameState.currentOver = [];

    // Change strike at end of over
    gameState.striker = gameState.striker === 'batsman1' ? 'batsman2' : 'batsman1';

    // Reset bowler for new over
    gameState.bowler = { name: '', overs: 0, balls: 0, runs: 0, wickets: 0, saved: false };
    const bowlerInput = document.getElementById('bowler');
    bowlerInput.value = '';
    bowlerInput.disabled = false;
}

function newOver() {
    if (gameState.bowler.balls % 6 === 0) {
        completeOver();
        updateDisplay();
    //    alert('Over completed! Please select new bowler.');
    } else {
        alert('Current over is not complete yet!');
    }
}

function endInnings() {
    if (gameState.innings === 1) {
        // Save current batsmen to roster
        Object.keys(gameState.batsmen).forEach(key => {
            if (gameState.batsmen[key].saved) {
                addBatsmanToRoster(key);
            }
        });

        // Save current bowler
        if (gameState.bowler.saved) {
            const bowlingTeamKey = gameState.bowlingTeam;
            const existingBowlerIndex = gameState.bowlers[bowlingTeamKey].findIndex(b => b.name === gameState.bowler.name);
            
            const bowlerStats = {
                name: gameState.bowler.name,
                overs: Math.floor(gameState.bowler.balls / 6),
                balls: gameState.bowler.balls % 6,
                runs: gameState.bowler.runs,
                wickets: gameState.bowler.wickets,
                economy: gameState.bowler.balls > 0 ? ((gameState.bowler.runs / (gameState.bowler.balls / 6))).toFixed(2) : 0
            };

            if (existingBowlerIndex >= 0) {
                gameState.bowlers[bowlingTeamKey][existingBowlerIndex] = bowlerStats;
            } else {
                gameState.bowlers[bowlingTeamKey].push(bowlerStats);
            }
        }

        // Set target for second innings
        gameState.target = gameState.scores[gameState.battingTeam] + 1;

        // Switch innings
        gameState.innings = 2;
        const temp = gameState.battingTeam;
        gameState.battingTeam = gameState.bowlingTeam;
        gameState.bowlingTeam = temp;

        // Reset for second innings
        gameState.batsmen = {
            batsman1: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, ones: 0, twos: 0, dots: 0, isOut: false, saved: false },
            batsman2: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, ones: 0, twos: 0, dots: 0, isOut: false, saved: false }
        };
        gameState.striker = 'batsman1';
        gameState.bowler = { name: '', overs: 0, balls: 0, runs: 0, wickets: 0, saved: false };
        gameState.currentOver = [];
        gameState.inningsEnded = false;

        // Enable inputs
        document.getElementById('batsman1').disabled = false;
        document.getElementById('batsman2').disabled = false;
        document.getElementById('bowler').disabled = false;
        document.getElementById('batsman1').value = '';
        document.getElementById('batsman2').value = '';
        document.getElementById('bowler').value = '';

        updateDisplay();
        alert(`First innings ended! ${gameState.teams[gameState.battingTeam]} needs ${gameState.target} runs to win.`);
    } else {
        endMatch();
    }
}

function checkMatchEnd() {
    const currentScore = gameState.scores[gameState.battingTeam];
    const currentWickets = gameState.wickets[gameState.battingTeam];
    const currentOvers = gameState.oversCompleted[gameState.battingTeam];
    const currentBalls = gameState.ballsInCurrentOver[gameState.battingTeam];

    // Check if all overs completed
    if (currentOvers >= gameState.totalOvers) {
        if (gameState.innings === 1) {
            endInnings();
        } else {
            endMatch();
        }
        return;
    }

    // Check if all wickets fallen
    if (currentWickets >= gameState.playersPerTeam - 1) {
        if (gameState.innings === 1) {
            endInnings();
        } else {
            endMatch();
        }
        return;
    }

    // Check if target achieved in second innings
    if (gameState.innings === 2 && currentScore >= gameState.target) {
        endMatch();
        return;
    }
}

function endMatch() {
    gameState.matchEnded = true;
    
    // Save current players to roster
    Object.keys(gameState.batsmen).forEach(key => {
        if (gameState.batsmen[key].saved) {
            addBatsmanToRoster(key);
        }
    });

    // Save current bowler
    if (gameState.bowler.saved) {
        const bowlingTeamKey = gameState.bowlingTeam;
        const existingBowlerIndex = gameState.bowlers[bowlingTeamKey].findIndex(b => b.name === gameState.bowler.name);
        
        const bowlerStats = {
            name: gameState.bowler.name,
            overs: Math.floor(gameState.bowler.balls / 6),
            balls: gameState.bowler.balls % 6,
            runs: gameState.bowler.runs,
            wickets: gameState.bowler.wickets,
            economy: gameState.bowler.balls > 0 ? ((gameState.bowler.runs / (gameState.bowler.balls / 6))).toFixed(2) : 0
        };

        if (existingBowlerIndex >= 0) {
            gameState.bowlers[bowlingTeamKey][existingBowlerIndex] = bowlerStats;
        } else {
            gameState.bowlers[bowlingTeamKey].push(bowlerStats);
        }
    }

    // Determine winner
    if (gameState.scores.team1 > gameState.scores.team2) {
        gameState.winner = 'team1';
    } else if (gameState.scores.team2 > gameState.scores.team1) {
        gameState.winner = 'team2';
    } else {
        gameState.winner = 'tie';
    }

    showMatchEnd();
}

function showMatchEnd() {
    document.getElementById('match-section').classList.add('hidden');
    document.getElementById('match-end-section').classList.remove('hidden');

    const winnerElement = document.getElementById('winner-announcement');
    const detailsElement = document.getElementById('match-details');
    const manOfMatchElement = document.getElementById('man-of-match');

    if (gameState.winner === 'tie') {
        winnerElement.textContent = "It's a Tie!";
    } else {
        const winnerTeamName = gameState.teams[gameState.winner];
        const runDifference = Math.abs(gameState.scores.team1 - gameState.scores.team2);
        winnerElement.textContent = `${winnerTeamName} Wins!`;
        
        if (gameState.innings === 2 && gameState.scores[gameState.battingTeam] >= gameState.target) {
            const wicketsRemaining = (gameState.playersPerTeam - 1) - gameState.wickets[gameState.battingTeam];
            detailsElement.textContent = `${winnerTeamName} won by ${wicketsRemaining} wickets`;
        } else {
            detailsElement.textContent = `${winnerTeamName} won by ${runDifference} runs`;
        }
    }

    // Find man of the match (highest scorer)
    let manOfMatch = { name: '', runs: 0 };
    Object.values(gameState.players).forEach(team => {
        team.forEach(player => {
            if (player.runs > manOfMatch.runs) {
                manOfMatch = player;
            }
        });
    });

    if (manOfMatch.name) {
        manOfMatchElement.textContent = `Man of the Match: ${manOfMatch.name} (${manOfMatch.runs} runs)`;
    }
}

function updateDisplay() {
    // Update batting team name
    const battingTeamName = gameState.teams[gameState.battingTeam];
    document.getElementById('batting-team-name').textContent = battingTeamName;

    // Update scores
    const currentScore = gameState.scores[gameState.battingTeam];
    const currentWickets = gameState.wickets[gameState.battingTeam];
    const currentOvers = gameState.oversCompleted[gameState.battingTeam];
    const currentBalls = gameState.ballsInCurrentOver[gameState.battingTeam];
    
    document.getElementById('current-score').textContent = currentScore;
    document.getElementById('current-wickets').textContent = currentWickets;
    document.getElementById('current-overs').textContent = `${currentOvers}.${currentBalls}`;

    // Update over display
    const overNumber = Math.floor(gameState.bowler.balls / 6) + 1;
    document.getElementById('over-number').textContent = overNumber;
    
    const ballsDisplay = document.getElementById('balls-display');
    ballsDisplay.innerHTML = '';
    gameState.currentOver.forEach((ball, index) => {
        const ballElement = document.createElement('div');
        ballElement.className = `ball ball-${ball}`;
        ballElement.textContent = ball;
        ballsDisplay.appendChild(ballElement);
    });

    // Update batsmen stats
    ['batsman1', 'batsman2'].forEach(key => {
        const batsman = gameState.batsmen[key];
        const strikeRate = batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0';
        
        document.getElementById(`${key}-runs`).textContent = batsman.runs;
        document.getElementById(`${key}-balls`).textContent = batsman.balls;
        document.getElementById(`${key}-sr`).textContent = strikeRate;
        document.getElementById(`${key}-dots`).textContent = batsman.dots;
        document.getElementById(`${key}-ones`).textContent = batsman.ones;
        document.getElementById(`${key}-twos`).textContent = batsman.twos;
        document.getElementById(`${key}-fours`).textContent = batsman.fours;
        document.getElementById(`${key}-sixes`).textContent = batsman.sixes;
    });

    // Update striker indication
    document.getElementById('batsman1-card').classList.toggle('striker', gameState.striker === 'batsman1');
    document.getElementById('batsman2-card').classList.toggle('striker', gameState.striker === 'batsman2');

    // Update bowler stats
    const bowlerOvers = `${Math.floor(gameState.bowler.balls / 6)}.${gameState.bowler.balls % 6}`;
    document.getElementById('bowler-overs').textContent = bowlerOvers;
    document.getElementById('bowler-runs').textContent = gameState.bowler.runs;
    document.getElementById('bowler-wickets').textContent = gameState.bowler.wickets;

    // Show target if second innings
    if (gameState.innings === 2) {
        const remainingRuns = gameState.target - gameState.scores[gameState.battingTeam];
        const remainingBalls = (gameState.totalOvers * 6) - (gameState.oversCompleted[gameState.battingTeam] * 6 + gameState.ballsInCurrentOver[gameState.battingTeam]);
        
        if (remainingRuns > 0) {
            document.getElementById('batting-team-name').innerHTML = `${battingTeamName}<br><small>Need ${remainingRuns} in ${remainingBalls} balls</small>`;
        }
    }
}

function showScorecard() {
    document.getElementById('match-section').classList.add('hidden');
    document.getElementById('scorecard-section').classList.remove('hidden');
    generateScorecard();
}

function hideScorecard() {
    document.getElementById('scorecard-section').classList.add('hidden');
    document.getElementById('match-section').classList.remove('hidden');
}

function generateScorecard() {
    const scorecardContent = document.getElementById('scorecard-content');
    let html = `
        <div class="innings-summary">
            <div class="innings-title">${gameState.teams.team1} vs ${gameState.teams.team2}</div>
            <p>Match Type: ${gameState.totalOvers} overs per side</p>
        </div>
    `;

    // First innings scorecard
    const firstInningsTeam = gameState.innings === 1 ? gameState.battingTeam : (gameState.battingTeam === 'team1' ? 'team2' : 'team1');
    html += generateInningsScorecard(firstInningsTeam, '1st Innings');

    // Second innings scorecard (if started)
    if (gameState.innings === 2) {
        const secondInningsTeam = gameState.battingTeam;
        html += generateInningsScorecard(secondInningsTeam, '2nd Innings');
    }

    scorecardContent.innerHTML = html;
}

function generateInningsScorecard(teamKey, inningsTitle) {
    const teamName = gameState.teams[teamKey];
    const score = gameState.scores[teamKey];
    const wickets = gameState.wickets[teamKey];
    const overs = gameState.oversCompleted[teamKey];
    const balls = teamKey === gameState.battingTeam ? gameState.ballsInCurrentOver[teamKey] : 0;

    let html = `
        <div class="innings-summary">
            <div class="innings-title">${teamName} - ${inningsTitle}</div>
            <p>Score: ${score}/${wickets} (${overs}.${balls} overs)</p>
        </div>
        
        <table class="scorecard-table">
            <thead>
                <tr>
                    <th>Batsman</th>
                    <th>R</th>
                    <th>B</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>SR</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Add current batsmen if this is the current batting team
    if (teamKey === gameState.battingTeam && !gameState.matchEnded) {
        ['batsman1', 'batsman2'].forEach(key => {
            const batsman = gameState.batsmen[key];
            if (batsman.saved) {
                const sr = batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0';
                const status = key === gameState.striker ? ' *' : '';
                html += `
                    <tr>
                        <td>${batsman.name}${status}</td>
                        <td>${batsman.runs}</td>
                        <td>${batsman.balls}</td>
                        <td>${batsman.fours}</td>
                        <td>${batsman.sixes}</td>
                        <td>${sr}</td>
                    </tr>
                `;
            }
        });
    }

    // Add completed batsmen
    if (gameState.players[teamKey]) {
        gameState.players[teamKey].forEach(player => {
            html += `
                <tr>
                    <td>${player.name}${player.isOut ? ' (out)' : ''}</td>
                    <td>${player.runs}</td>
                    <td>${player.balls}</td>
                    <td>${player.fours}</td>
                    <td>${player.sixes}</td>
                    <td>${player.strikeRate}</td>
                </tr>
            `;
        });
    }

    html += `
            </tbody>
        </table>
        
        <h4>Bowling</h4>
        <table class="scorecard-table">
            <thead>
                <tr>
                    <th>Bowler</th>
                    <th>O</th>
                    <th>R</th>
                    <th>W</th>
                    <th>Econ</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Add current bowler if applicable
    const bowlingTeamKey = teamKey === 'team1' ? 'team2' : 'team1';
    if (teamKey === gameState.battingTeam && gameState.bowler.saved && !gameState.matchEnded) {
        const overs = `${Math.floor(gameState.bowler.balls / 6)}.${gameState.bowler.balls % 6}`;
        const economy = gameState.bowler.balls > 0 ? ((gameState.bowler.runs / (gameState.bowler.balls / 6))).toFixed(2) : '0.00';
        html += `
            <tr>
                <td>${gameState.bowler.name} *</td>
                <td>${overs}</td>
                <td>${gameState.bowler.runs}</td>
                <td>${gameState.bowler.wickets}</td>
                <td>${economy}</td>
            </tr>
        `;
    }

    // Add completed bowlers
    if (gameState.bowlers[bowlingTeamKey]) {
        gameState.bowlers[bowlingTeamKey].forEach(bowler => {
            const overs = `${bowler.overs}.${bowler.balls}`;
            html += `
                <tr>
                    <td>${bowler.name}</td>
                    <td>${overs}</td>
                    <td>${bowler.runs}</td>
                    <td>${bowler.wickets}</td>
                    <td>${bowler.economy}</td>
                </tr>
            `;});
    }

    html += `
            </tbody>
        </table>
    `;

    return html;
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(`${gameState.teams.team1} vs ${gameState.teams.team2}`, 20, 20);

    // Add match info
    doc.setFontSize(12);
    doc.text(`Match Type: ${gameState.totalOvers} overs per side`, 20, 35);

    let yPosition = 50;

    // Add match result if ended
    if (gameState.matchEnded) {
        doc.setFontSize(16);
        if (gameState.winner === 'tie') {
            doc.text("Result: It's a Tie!", 20, yPosition);
        } else {
            const winnerTeamName = gameState.teams[gameState.winner];
            doc.text(`Result: ${winnerTeamName} Wins!`, 20, yPosition);
        }
        yPosition += 20;
    }

    // Add team scores
    doc.setFontSize(14);
    doc.text(`${gameState.teams.team1}: ${gameState.scores.team1}/${gameState.wickets.team1}`, 20, yPosition);
    doc.text(`${gameState.teams.team2}: ${gameState.scores.team2}/${gameState.wickets.team2}`, 120, yPosition);
    yPosition += 25;

    // Add batting details for both teams
    Object.keys(gameState.players).forEach(teamKey => {
        if (gameState.players[teamKey].length > 0) {
            doc.setFontSize(12);
            doc.text(`${gameState.teams[teamKey]} Batting:`, 20, yPosition);
            yPosition += 15;

            gameState.players[teamKey].forEach(player => {
                const playerText = `${player.name}: ${player.runs} runs (${player.balls} balls, ${player.fours} fours, ${player.sixes} sixes)`;
                doc.text(playerText, 25, yPosition);
                yPosition += 10;
            });
            yPosition += 10;
        }
    });

    // Add bowling details
    Object.keys(gameState.bowlers).forEach(teamKey => {
        if (gameState.bowlers[teamKey].length > 0) {
            doc.text(`${gameState.teams[teamKey]} Bowling:`, 20, yPosition);
            yPosition += 15;

            gameState.bowlers[teamKey].forEach(bowler => {
                const bowlerText = `${bowler.name}: ${bowler.overs}.${bowler.balls} overs, ${bowler.runs} runs, ${bowler.wickets} wickets`;
                doc.text(bowlerText, 25, yPosition);
                yPosition += 10;
            });
            yPosition += 10;
        }
    });

    // Save the PDF
    const fileName = `${gameState.teams.team1}_vs_${gameState.teams.team2}_Scorecard.pdf`;
    doc.save(fileName);
}

function newMatch() {
    // Reset all game state
    gameState = {
        teams: { team1: '', team2: '' },
        battingTeam: '',
        bowlingTeam: '',
        innings: 1,
        totalOvers: 20,
        playersPerTeam: 11,
        scores: { team1: 0, team2: 0 },
        wickets: { team1: 0, team2: 0 },
        oversCompleted: { team1: 0, team2: 0 },
        ballsInCurrentOver: { team1: 0, team2: 0 },
        currentOver: [],
        batsmen: {
            batsman1: { 
                name: '', 
                runs: 0, 
                balls: 0, 
                fours: 0, 
                sixes: 0, 
                ones: 0, 
                twos: 0, 
                dots: 0, 
                isOut: false,
                saved: false
            },
            batsman2: { 
                name: '', 
                runs: 0, 
                balls: 0, 
                fours: 0, 
                sixes: 0, 
                ones: 0, 
                twos: 0, 
                dots: 0, 
                isOut: false,
                saved: false
            }
        },
        striker: 'batsman1',
        bowler: { name: '', overs: 0, balls: 0, runs: 0, wickets: 0, saved: false },
        players: { team1: [], team2: [] },
        bowlers: { team1: [], team2: [] },
        ballByBall: [],
        matchEnded: false,
        winner: '',
        inningsEnded: false,
        target: 0
    };

    // Reset form inputs
    document.getElementById('team1').value = '';
    document.getElementById('team2').value = '';
    document.getElementById('toss-winner').innerHTML = '<option value="">Select toss winner</option>';
    document.getElementById('batting-first').value = 'bat';
    document.getElementById('overs').value = '20';
    document.getElementById('players-per-team').value = '11';

    // Reset player inputs
    document.getElementById('batsman1').value = '';
    document.getElementById('batsman2').value = '';
    document.getElementById('bowler').value = '';
    document.getElementById('batsman1').disabled = false;
    document.getElementById('batsman2').disabled = false;
    document.getElementById('bowler').disabled = false;

    // Show setup section and hide others
    document.getElementById('setup-section').classList.remove('hidden');
    document.getElementById('match-section').classList.add('hidden');
    document.getElementById('scorecard-section').classList.add('hidden');
    document.getElementById('match-end-section').classList.add('hidden');

    // Reinitialize toss options
    initializeTossOptions();
}

// Additional utility functions

function undoLastBall() {
    if (gameState.ballByBall.length === 0 || gameState.matchEnded) return;

    const lastBall = gameState.ballByBall.pop();
    const lastOverBall = gameState.currentOver.pop();

    // Reverse the changes made by the last ball
    if (lastBall.isWicket) {
        gameState.wickets[gameState.battingTeam]--;
        gameState.bowler.wickets--;
    } else {
        gameState.scores[gameState.battingTeam] -= lastBall.runs;
        gameState.batsmen[gameState.striker].runs -= lastBall.runs;
        gameState.bowler.runs -= lastBall.runs;

        // Reverse specific run type counts
        if (lastBall.runs === 0) gameState.batsmen[gameState.striker].dots--;
        if (lastBall.runs === 1) gameState.batsmen[gameState.striker].ones--;
        if (lastBall.runs === 2) gameState.batsmen[gameState.striker].twos--;
        if (lastBall.runs === 4) gameState.batsmen[gameState.striker].fours--;
        if (lastBall.runs === 6) gameState.batsmen[gameState.striker].sixes--;
    }

    // Reverse ball and over counts
    gameState.batsmen[gameState.striker].balls--;
    gameState.bowler.balls--;
    gameState.ballsInCurrentOver[gameState.battingTeam]--;

    // Handle over boundaries
    if (gameState.ballsInCurrentOver[gameState.battingTeam] < 0) {
        gameState.ballsInCurrentOver[gameState.battingTeam] = 5;
        gameState.oversCompleted[gameState.battingTeam]--;
    }

    updateDisplay();
    alert('Last ball undone!');
}

function getMatchSummary() {
    let summary = `Match Summary:\n`;
    summary += `${gameState.teams.team1} vs ${gameState.teams.team2}\n`;
    summary += `${gameState.totalOvers} overs per side\n\n`;

    summary += `Final Scores:\n`;
    summary += `${gameState.teams.team1}: ${gameState.scores.team1}/${gameState.wickets.team1}\n`;
    summary += `${gameState.teams.team2}: ${gameState.scores.team2}/${gameState.wickets.team2}\n\n`;

    if (gameState.matchEnded) {
        if (gameState.winner === 'tie') {
            summary += `Result: It's a Tie!\n`;
        } else {
            summary += `Winner: ${gameState.teams[gameState.winner]}\n`;
        }
    }

    return summary;
}

function validateInput(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (!value) {
        alert(errorMessage);
        input.focus();
        return false;
    }
    return true;
}

// Event listeners for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (gameState.matchEnded || gameState.inningsEnded) return;

    // Number keys for runs
    if (event.key >= '0' && event.key <= '6') {
        const runs = parseInt(event.key);
        if (runs <= 6) {
            addRun(runs);
        }
    }

    // 'W' key for wicket
    if (event.key.toLowerCase() === 'w') {
        addWicket();
    }

    // 'U' key for undo (if implemented)
    if (event.key.toLowerCase() === 'u' && event.ctrlKey) {
        event.preventDefault();
        undoLastBall();
    }
});

// Auto-save functionality (using memory instead of localStorage)
let autoSaveData = null;

function autoSave() {
    autoSaveData = JSON.stringify(gameState);
}

function loadAutoSave() {
    if (autoSaveData) {
        try {
            gameState = JSON.parse(autoSaveData);
            updateDisplay();
            alert('Previous match data loaded!');
        } catch (error) {
            console.error('Error loading auto-save data:', error);
        }
    }
}

// Set up auto-save interval (every 30 seconds)
setInterval(autoSave, 30000);
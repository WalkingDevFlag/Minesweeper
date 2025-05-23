// Minesweeper Game Logic
// Original Author: Unknown (from minified source)
// De-obfuscated and Refactored for Readability

function Minesweeper(initialHighScores, getGameSettingsCallback) {
    var self = this; // Reference to the Minesweeper instance

    // Game state variables
    var gameTypeId;
    var numRows;
    var numCols;
    var numMines;
    var zoomFactor; 
    var lastGoodGridState; 
    var isRestoredGame; 
    var minesLeftToFlag;
    var squaresLeftToReveal;
    var gameGrid; 
    var squareCacheById; 

    var timer = new Timer(); 

    // UI/Interaction state variables
    var isGameOver;
    var hasGameStartedPlaying; 
    var nonMineSquaresList; 
    var gameKeyForServer; 
    var isIE7OrLess; 

    var isChordInProgress; 
    var isLeftMouseDown;
    var isRightMouseDown;
    var activeTouchIdentifier;
    var isGestureInProgress; 
    var isMouseDownForCtrlClick = false; 
    
    var hoveredSquareId = ""; 

    initializeEventHandlers(); 

    this.newGame = function(restoredGridData, newGameSettings) {
        var prevGridSignature, currentGridSignature;
        var currentSettings = getGameSettingsCallback();

        prevGridSignature = getGridConfigSignature(); 

        gameTypeId = currentSettings.gameTypeId;
        numRows = currentSettings.numRows;
        numCols = currentSettings.numCols;
        numMines = currentSettings.numMines;
        zoomFactor = 1; 

        if (newGameSettings) {
            if (typeof newGameSettings.gameTypeId !== "undefined") gameTypeId = newGameSettings.gameTypeId;
            if (typeof newGameSettings.numRows !== "undefined") numRows = newGameSettings.numRows;
            if (typeof newGameSettings.numCols !== "undefined") numCols = newGameSettings.numCols;
            if (typeof newGameSettings.numMines !== "undefined") numMines = newGameSettings.numMines;
        }

        currentGridSignature = getGridConfigSignature();
        var boardConfigChanged = (prevGridSignature !== currentGridSignature);

        updateGameContainerSize(); 

        if (boardConfigChanged) {
            buildGameBoardUI(); 
        }

        initializeGridAndMines(restoredGridData);
        saveCurrentGridState(); 

        isRestoredGame = !!restoredGridData;
        minesLeftToFlag = numMines;
        squaresLeftToReveal = numRows * numCols - numMines;

        for (var r = 1; r <= numRows; r++) {
            for (var c = 1; c <= numCols; c++) {
                var square = gameGrid[r][c];
                if (square.isFlagged()) {
                    square.setClass("square bombflagged");
                    minesLeftToFlag--;
                } else if (square.isMarked()) { 
                    square.setClass("square question");
                } else if (square.isRevealed()) {
                    square.setClass("square open" + square.getValue());
                    if (!square.isHidden()) { 
                        squaresLeftToReveal--;
                    }
                } else {
                    square.setClass("square blank");
                }
            }
        }

        timer.stop();
        if (!isRestoredGame) {
            timer.setTime(0);
        } else {
            if (newGameSettings && typeof newGameSettings.time !== "undefined") {
                timer.setTime(newGameSettings.time);
            }
        }
        updateMinesLeftDisplay();

        isGameOver = false;
        hasGameStartedPlaying = false; 
        isChordInProgress = false;
        isLeftMouseDown = false;
        isRightMouseDown = false;
        activeTouchIdentifier = null;
        isGestureInProgress = false;
        isMouseDownForCtrlClick = false; 
        
        if(document.getElementById("face")) $("#face")[0].className = "facesmile"; // Check if face exists
        hoveredSquareId = "";
    };

    this.hasStartedPlaying = function() {
        return hasGameStartedPlaying;
    };

    function updateGameContainerSize() {
        var effectiveZoom = 1; 
        $("#game-container, #game").width(effectiveZoom * (numCols * 16 + 20));
        $("#game").height(effectiveZoom * (numRows * 16 + 30 + 26 + 6));
    }

    function calculateFaceMargin() {
        var effectiveZoom = 1;
        return (effectiveZoom * numCols * 16 - 6 * Math.ceil(effectiveZoom * 13) - effectiveZoom * 2 * 6 - effectiveZoom * 26) / 2;
    }

    function getGridConfigSignature() {
        if (typeof numRows === 'undefined') return ""; 
        return numRows + "_" + numCols + "_" + numMines;
    }

    function buildGameBoardUI() {
        var r, c;
        var htmlParts = [];
        var faceMargin = calculateFaceMargin();

        htmlParts.push('<div class="bordertl"></div>');
        for (c = 0; c < numCols; c++) { htmlParts.push('<div class="bordertb"></div>'); }
        htmlParts.push('<div class="bordertr"></div>');

        htmlParts.push('<div class="borderlrlong"></div>'); 
        htmlParts.push('<div class="time0" id="mines_hundreds"></div>');
        htmlParts.push('<div class="time0" id="mines_tens"></div>');
        htmlParts.push('<div class="time0" id="mines_ones"></div>');
        htmlParts.push('<div class="facesmile" style="margin-left:', Math.floor(faceMargin), 'px; margin-right:', Math.ceil(faceMargin), 'px;" id="face"></div>');
        htmlParts.push('<div class="time0" id="seconds_hundreds"></div>');
        htmlParts.push('<div class="time0" id="seconds_tens"></div>');
        htmlParts.push('<div class="time0" id="seconds_ones"></div>');
        htmlParts.push('<div class="borderlrlong"></div>'); 

        htmlParts.push('<div class="borderjointl"></div>');
        for (c = 0; c < numCols; c++) { htmlParts.push('<div class="bordertb"></div>'); }
        htmlParts.push('<div class="borderjointr"></div>');

        for (r = 1; r <= numRows; r++) {
            htmlParts.push('<div class="borderlr"></div>'); 
            for (c = 1; c <= numCols; c++) {
                htmlParts.push('<div class="square blank" id="', r, "_", c, '"></div>');
            }
            htmlParts.push('<div class="borderlr"></div>'); 
        }

        htmlParts.push('<div class="borderbl"></div>');
        for (c = 0; c < numCols; c++) { htmlParts.push('<div class="bordertb"></div>'); }
        htmlParts.push('<div class="borderbr"></div>');

        for (c = 0; c <= numCols + 1; c++) { htmlParts.push('<div class="square blank" style="display: none;" id="', 0, "_", c, '"></div>'); }
        for (c = 0; c <= numCols + 1; c++) { htmlParts.push('<div class="square blank" style="display: none;" id="', numRows + 1, "_", c, '"></div>'); }
        for (r = 1; r <= numRows; r++) {
            htmlParts.push('<div class="square blank" style="display: none;" id="', r, "_", 0, '"></div>');
            htmlParts.push('<div class="square blank" style="display: none;" id="', r, "_", numCols + 1, '"></div>');
        }
        $("#game").html(htmlParts.join(""));
    }

    function Square(row, col) {
        var value = 0;          
        var isFlaggedSquare = false;
        var isMarkedSquare = false;   
        var isRevealedSquare = false;

        this.addToValue = function(amount) { value += amount; };
        this.isMine = function() { return value < 0; };
        this.isFlagged = function() { return isFlaggedSquare; };
        this.isMarked = function() { return isMarkedSquare; };
        this.isRevealed = function() { return isRevealedSquare; };
        this.isHidden = function() { 
            return row < 1 || row > numRows || col < 1 || col > numCols;
        };
        this.getRow = function() { return row; };
        this.getCol = function() { return col; };
        this.getValue = function() { return value; };
        this.setRevealed = function(revealed) { isRevealedSquare = revealed; };

        this.plantMine = function() {
            value -= 10; 
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    if(gameGrid[row + dr] && gameGrid[row + dr][col + dc]) { // Boundary check
                        gameGrid[row + dr][col + dc].addToValue(1);
                    }
                }
            }
        };

        this.unplantMine = function() {
            value += 10; 
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                     if(gameGrid[row + dr] && gameGrid[row + dr][col + dc]) { // Boundary check
                        gameGrid[row + dr][col + dc].addToValue(-1);
                    }
                }
            }
        };

        this.setClass = function(className) {
            var el = document.getElementById(row + "_" + col);
            if (el) el.className = className;
        };

        this.reveal1 = function() { 
            var squaresToProcess = [];
            var currentSquare, neighborSquare;
            var cascadeMarkers = new Set();

            function markForCascade(sq) {
                cascadeMarkers.add(sq.getRow() + "_" + sq.getCol());
            }
            function isMarkedForCascade(sq) {
                return cascadeMarkers.has(sq.getRow() + "_" + sq.getCol());
            }

            squaresToProcess.push(this);
            markForCascade(this);

            while (squaresToProcess.length > 0) {
                currentSquare = squaresToProcess.pop();
                if (!currentSquare.isRevealed() && !currentSquare.isFlagged()) {
                    if (currentSquare.isMine()) {
                        return false; 
                    } else {
                        currentSquare.setClass("square open" + currentSquare.getValue());
                        currentSquare.setRevealed(true);

                        if (!currentSquare.isHidden()) { 
                           if (--squaresLeftToReveal === 0) {
                                handleWin();
                                return true; 
                           }
                        }

                        if (currentSquare.getValue() === 0 && !currentSquare.isHidden()) {
                            for (var dr = -1; dr <= 1; dr++) {
                                for (var dc = -1; dc <= 1; dc++) {
                                    if (gameGrid[currentSquare.getRow() + dr] && gameGrid[currentSquare.getRow() + dr][currentSquare.getCol() + dc]) {
                                        neighborSquare = gameGrid[currentSquare.getRow() + dr][currentSquare.getCol() + dc];
                                        if (!isMarkedForCascade(neighborSquare) && !neighborSquare.isHidden() && !neighborSquare.isRevealed()) {
                                            squaresToProcess.push(neighborSquare);
                                            markForCascade(neighborSquare);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            saveCurrentGridState();
            return true; 
        };

        this.reveal9 = function() { 
            if (isRevealedSquare) {
                var flaggedNeighbors = 0;
                var minesHitDuringChord = [];
                var neighborSquare;

                for (var dr = -1; dr <= 1; dr++) {
                    for (var dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        if (gameGrid[row + dr] && gameGrid[row + dr][col + dc]) {
                            neighborSquare = gameGrid[row + dr][col + dc];
                            if (neighborSquare.isFlagged()) {
                                flaggedNeighbors++;
                            }
                        }
                    }
                }

                if (flaggedNeighbors === value) { 
                    for (var dr = -1; dr <= 1; dr++) {
                        for (var dc = -1; dc <= 1; dc++) {
                             if (dr === 0 && dc === 0) continue;
                            if (gameGrid[row + dr] && gameGrid[row + dr][col + dc]) {
                                neighborSquare = gameGrid[row + dr][col + dc];
                                if (!neighborSquare.isFlagged() && !neighborSquare.isHidden()) { 
                                    if (!neighborSquare.reveal1()) { 
                                        minesHitDuringChord.push(neighborSquare); 
                                    }
                                }
                            }
                        }
                    }
                    if (minesHitDuringChord.length > 0) {
                        handleLoss(minesHitDuringChord); 
                    } else {
                        saveCurrentGridState();
                    }
                }
            }
        };

        this.flag = function(useAnimation) {
            if (!isRevealedSquare) {
                var useQuestionMarks = false; 

                if (isFlaggedSquare) { 
                    if (useQuestionMarks) { 
                        this.setClass("square question");
                        isMarkedSquare = true;
                    } else {
                        this.setClass("square blank");
                        if (useAnimation) { this._showFlagAnimation(true); } 
                    }
                    isFlaggedSquare = false;
                    minesLeftToFlag++;
                    updateMinesLeftDisplay();
                } else if (isMarkedSquare) { 
                    this.setClass("square blank");
                    isMarkedSquare = false;
                } else { 
                    this.setClass("square bombflagged");
                    isFlaggedSquare = true;
                    minesLeftToFlag--;
                    updateMinesLeftDisplay();
                    if (useAnimation) { this._showFlagAnimation(false); } 
                }
                saveCurrentGridState();
            }
        };

        this._showFlagAnimation = function(isUnflagging) {
            var $squareEl = $("#" + row + "_" + col);
            if (!$squareEl.length) return; // Element doesn't exist
            var offset = $squareEl.offset();
            var centerX = offset.left + $squareEl.width() / 2;
            var centerY = offset.top + $squareEl.height() / 2;

            var animZoom = 1; 
            var flagWidth = 57 * animZoom * 1.75;
            var flagHeight = 79 * animZoom * 1.75;

            var startCss = {
                left: centerX - flagWidth / 2,
                top: centerY - flagHeight / 2,
                width: flagWidth + "px",
                height: flagHeight + "px",
                opacity: 0
            };
            var endCss = {
                left: centerX,
                top: centerY,
                width: 0,
                height: 0,
                opacity: 1
            };

            if (isUnflagging) { 
                var temp = startCss;
                startCss = endCss;
                endCss = temp;
            }
            // *** UPDATED PATH HERE ***
            var $animImg = $('<img src="asset/flag.png" class="flag-animation"></div>').css(startCss);
            $("body").append($animImg);
            setTimeout(function() { $animImg.css(endCss); }, 0); 
            setTimeout(function() { $animImg.remove(); }, 500); 
        };
        
        this.serializeToObj = function(useCompactFormat) {
            if (useCompactFormat) {
                if (!isRevealedSquare && !isFlaggedSquare && !isMarkedSquare) {
                    return value; 
                } else {
                    return [value, isRevealedSquare ? 1 : 0, isFlaggedSquare ? 1 : 0, isMarkedSquare ? 1 : 0];
                }
            } else {
                return { value: value, isRevealed: isRevealedSquare, isFlagged: isFlaggedSquare, isMarked: isMarkedSquare };
            }
        };

        this.deserializeFromObj = function(objData) {
            value = objData.value;
            isFlaggedSquare = objData.isFlagged;
            isMarkedSquare = objData.isMarked;
            isRevealedSquare = objData.isRevealed;
        };
    }

    function initializeGridAndMines(restoredGridData) {
        var r, c, i;
        var square;

        gameGrid = [];
        squareCacheById = {};
        nonMineSquaresList = []; 

        var currentSquareIndex = 0;
        for (r = 0; r <= numRows + 1; r++) { 
            gameGrid[r] = [];
            for (c = 0; c <= numCols + 1; c++) { 
                square = new Square(r, c);
                gameGrid[r][c] = square;
                squareCacheById[r + "_" + c] = square;
                if (!square.isHidden()) { 
                    nonMineSquaresList[currentSquareIndex++] = square;
                }
            }
        }

        if (restoredGridData) { 
            var loadedGrid = restoredGridData.gridObj;
            for (r = 0; r <= numRows + 1; r++) {
                for (c = 0; c <= numCols + 1; c++) {
                    gameGrid[r][c].deserializeFromObj(loadedGrid[r][c]);
                }
            }
            nonMineSquaresList = [];
            for (r = 0; r <= numRows + 1; r++) {
                for (c = 0; c <= numCols + 1; c++) {
                    square = gameGrid[r][c];
                    if (!square.isHidden() && !square.isMine()) {
                        nonMineSquaresList.push(square);
                    }
                }
            }
        } else { 
            for (i = 0; i < numMines; i++) {
                if(nonMineSquaresList.length > 0) { // Ensure list is not empty
                    var mineToPlant = nonMineSquaresList.splice(Math.floor(Math.random() * nonMineSquaresList.length), 1)[0];
                    mineToPlant.plantMine();
                } else {
                    // console.warn("Not enough non-mine squares to place all mines.");
                    break; 
                }
            }
        }
    }

    function serializeGridToArray(useCompactFormat) {
        var serialized = [];
        for (var r = 0; r <= numRows + 1; r++) {
            serialized[r] = [];
            for (var c = 0; c <= numCols + 1; c++) {
                serialized[r][c] = gameGrid[r][c].serializeToObj(useCompactFormat);
            }
        }
        return serialized;
    }

    function saveCurrentGridState() { 
        var gridState = serializeGridToArray(false); 
        lastGoodGridState = { gridObj: gridState };
    }

    function handleFirstClickSafety(clickedSquare) {
        var r = clickedSquare.getRow();
        var c = clickedSquare.getCol();
        var dr, dc, neighborSquare;
        var safeNonMineSquares = []; 

        if (!isRestoredGame) { 
            if (clickedSquare.isMine()) {
                var randomNonMineSquare = nonMineSquaresList[Math.floor(Math.random() * nonMineSquaresList.length)];
                if (randomNonMineSquare && randomNonMineSquare !== clickedSquare) { 
                    randomNonMineSquare.plantMine(); 
                    clickedSquare.unplantMine(); 
                    nonMineSquaresList.push(clickedSquare);
                    var idx = nonMineSquaresList.indexOf(randomNonMineSquare);
                    if (idx > -1) nonMineSquaresList.splice(idx, 1);
                } else if (nonMineSquaresList.length > 0 && nonMineSquaresList[0] !== clickedSquare) {
                    // Fallback if random pick was the clicked square itself (and there are other options)
                    nonMineSquaresList[0].plantMine();
                    clickedSquare.unplantMine();
                    nonMineSquaresList.push(clickedSquare);
                    nonMineSquaresList.splice(0,1);
                } else {
                    // console.warn("Could not find a suitable non-mine square to move the initial mine to.");
                }
            }
            
            // Re-filter nonMineSquaresList for the 3x3 safety logic
            safeNonMineSquares = [];
            for (var i = 0; i < nonMineSquaresList.length; i++) {
                var sq = nonMineSquaresList[i];
                 // Ensure sq is not the clicked square or its direct neighbors for moving mines from the 3x3 area
                if ( !(sq.getRow() >= r - 1 && sq.getRow() <= r + 1 && sq.getCol() >= c - 1 && sq.getCol() <= c + 1) ) {
                    safeNonMineSquares.push(sq);
                }
            }

            for (dr = -1; dr <= 1; dr++) {
                for (dc = -1; dc <= 1; dc++) {
                    if (gameGrid[r + dr] && gameGrid[r + dr][c + dc]) {
                        neighborSquare = gameGrid[r + dr][c + dc];
                        if (neighborSquare.isMine() && safeNonMineSquares.length > 0) {
                            var newMineLocation = safeNonMineSquares.splice(Math.floor(Math.random() * safeNonMineSquares.length), 1)[0];
                            newMineLocation.plantMine();
                            neighborSquare.unplantMine();
                            nonMineSquaresList.push(neighborSquare); // Add now non-mine square back
                            var idxNew = nonMineSquaresList.indexOf(newMineLocation); // Remove the new mine location
                            if(idxNew > -1) nonMineSquaresList.splice(idxNew, 1);
                        }
                    }
                }
            }
        }
        
        timer.start(); 
        
        if ((r === 1 && c === 1) || (r === 1 && c === numCols) || (r === numRows && c === 1) || (r === numRows && c === numCols)) {
            return 1; 
        } else if (r === 1 || r === numRows || c === 1 || c === numCols) {
            return 2; 
        } else {
            return 3; 
        }
    }
    
    function sendStartGameSignalToServer(squareType) { 
        if (gameTypeId > 0) { 
            generateGameKeyForServer();
            // $.post("start.php", { key: gameKeyForServer, s: squareType }); 
        }
    }

    function generateGameKeyForServer() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var i;
        gameKeyForServer = "";
        for (i = 0; i < 3; i++) { gameKeyForServer += chars.charAt(Math.floor(Math.random() * chars.length)); }
        gameKeyForServer += 4 * (Math.floor(Math.random() * 225) + 25) + gameTypeId; 
        for (i = 0; i < 4; i++) { gameKeyForServer += chars.charAt(Math.floor(Math.random() * chars.length)); }
    }

    function Timer() {
        var timerStartTime;     
        var totalElapsedTimeSeconds = 0; 
        var timerIntervalId;

        function tick() {
            var expectedElapsedTimeMs = totalElapsedTimeSeconds * 1000;
            var actualTimePassedMs = new Date().getTime() - timerStartTime;
            var driftMs = actualTimePassedMs - expectedElapsedTimeMs;
            var nextTickDelay = 1000 - driftMs;
            
            timerIntervalId = setTimeout(tick, Math.max(0, nextTickDelay)); 
            totalElapsedTimeSeconds++;
            updateTimerDisplay();
        }

        function updateTimerDisplay() {
            var digits = formatNumberToDigitsArray(totalElapsedTimeSeconds);
            var elH = document.getElementById("seconds_hundreds");
            var elT = document.getElementById("seconds_tens");
            var elO = document.getElementById("seconds_ones");
            if (elH && elT && elO) { 
                elH.className = "time" + digits[0];
                elT.className = "time" + digits[1];
                elO.className = "time" + digits[2];
            }
        }

        this.start = function() {
            if (timerIntervalId) return; 
            timerStartTime = new Date().getTime() - (totalElapsedTimeSeconds * 1000);
            tick();
        };
        this.stop = function() {
            clearTimeout(timerIntervalId);
            timerIntervalId = null;
        };
        this.getTime = function() { return totalElapsedTimeSeconds; };
        this.setTime = function(seconds) {
            totalElapsedTimeSeconds = seconds;
            updateTimerDisplay(); 
        };
    }

    function updateMinesLeftDisplay() {
        var digits = formatNumberToDigitsArray(minesLeftToFlag);
        var elH = document.getElementById("mines_hundreds");
        var elT = document.getElementById("mines_tens");
        var elO = document.getElementById("mines_ones");
         if (elH && elT && elO) { 
            elH.className = "time" + digits[0];
            elT.className = "time" + digits[1];
            elO.className = "time" + digits[2];
        }
    }

    function formatNumberToDigitsArray(number) { 
        number = Math.min(number, 999); 
        if (number >= 0) {
            return [
                Math.floor(number / 100),        
                Math.floor((number % 100) / 10),  
                number % 10                       
            ];
        } else { 
            return [
                "-",
                Math.floor((-number % 100) / 10),
                -number % 10
            ];
        }
    }

    function handleLoss(hitMines) { 
        var r, c, i;
        var square;
        if(document.getElementById("face")) document.getElementById("face").className = "facedead";
        timer.stop();
        isGameOver = true;

        for (r = 1; r <= numRows; r++) {
            columnloop: 
            for (c = 1; c <= numCols; c++) {
                square = gameGrid[r][c];
                if (!square.isRevealed()) {
                    for (i = 0; i < hitMines.length; i++) {
                        if (square === hitMines[i]) {
                            square.setClass("square bombdeath");
                            continue columnloop;
                        }
                    }
                    if (square.isMine() && !square.isFlagged()) {
                        square.setClass("square bombrevealed");
                    } else if (!square.isMine() && square.isFlagged()) {
                        square.setClass("square bombmisflagged");
                    }
                }
            }
        }
    }

    function handleWin() {
        var r, c;
        var square;
        var isNewHighScore = false;

        if(document.getElementById("face")) document.getElementById("face").className = "facewin";
        timer.stop();
        isGameOver = true;
        minesLeftToFlag = 0; 
        updateMinesLeftDisplay();

        for (r = 1; r <= numRows; r++) {
            for (c = 1; c <= numCols; c++) {
                square = gameGrid[r][c];
                if (!square.isRevealed() && !square.isFlagged()) { 
                    square.setClass("square bombflagged");
                }
            }
        }

        var gameTime = timer.getTime();
        if (gameTypeId > 0) { 
            if (!isRestoredGame) { 
                for (var scoreLevel = 3; scoreLevel >= 0; scoreLevel--) { 
                    if (initialHighScores[scoreLevel] && initialHighScores[scoreLevel][gameTypeId - 1] !== undefined && gameTime <= initialHighScores[scoreLevel][gameTypeId - 1]) {
                        submitHighScore(scoreLevel + 1, true); 
                        isNewHighScore = true;
                        break;
                    }
                }
                if (!isNewHighScore &&
                    ((gameTypeId === 1 && gameTime <= 10) ||  
                     (gameTypeId === 2 && gameTime <= 50) ||  
                     (gameTypeId === 3 && gameTime <= 150))) { 
                    submitHighScore(1, false); 
                }
            }
        }
        if (self.onWin) { 
            self.onWin(gameTypeId, gameTime);
        }
    }

    function submitHighScore(scoreCategory, isOfficialRecord) { 
        var categoryName;
        var name, timeSubmitted;
        var promptStartTime = (new Date()).getTime();
        var timeToEnterName;

        switch (scoreCategory) {
            case 1: categoryName = "daily"; break;
            case 2: categoryName = "weekly"; break;
            case 3: categoryName = "monthly"; break;
            case 4: categoryName = "all-time"; break;
            default: categoryName = ""; break;
        }

        var storedName = (checkLocalStorageSupport() && localStorage.name) ? localStorage.name : "";
        var promptMessage = isOfficialRecord ?
            timer.getTime() + " is a new " + categoryName + " high score! Please enter your name" :
            "Please enter your name to submit your score (" + timer.getTime() + ")";
        
        name = prompt(promptMessage, storedName);
        name = $.trim(name || "").substring(0, 25); 

        if (name && checkLocalStorageSupport()) {
            localStorage.name = name;
        }

        timeToEnterName = Math.round(((new Date()).getTime() - promptStartTime) / 1000);
        
         if (isOfficialRecord && self.onNewHighScore) {
             self.onNewHighScore(scoreCategory, isOfficialRecord);
         }
    }

    function checkLocalStorageSupport() {
        try {
            return "localStorage" in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    function isElementASquare(element) {
        if (!element || !element.className) return false;
        return element.className.substring(0, 6) === "square"; 
    }

    function getMouseButtonStates(event) {
        var buttons = {};
        if (isIE7OrLess) { 
            buttons.left = event.button === 1 || event.button === 3 || event.button === 4; 
            buttons.right = event.button === 2 || event.button === 3 || event.button === 4;
        } else { 
            buttons.left = event.button === 0 || event.button === 1; 
            buttons.right = event.button === 2 || event.button === 1; 
        }
        return buttons;
    }

    function updateSquareClassOnHover(square, pressClass, normalClassIfMarked) {
        if (!square || square.isRevealed()) return;

        if (square.isMarked()) {
            square.setClass(normalClassIfMarked); 
        } else if (!square.isFlagged()) {
            square.setClass(pressClass); 
        }
    }
    function updateNeighborSquaresClassOnHover(centerSquare, pressClass, normalClassIfMarked) {
        for (var dr = -1; dr <= 1; dr++) {
            for (var dc = -1; dc <= 1; dc++) {
                if (gameGrid[centerSquare.getRow() + dr] && gameGrid[centerSquare.getRow() + dr][centerSquare.getCol() + dc]){
                    updateSquareClassOnHover(gameGrid[centerSquare.getRow() + dr][centerSquare.getCol() + dc], pressClass, normalClassIfMarked);
                }
            }
        }
    }

    function initializeEventHandlers() {
        var isFacePressed = false;
        var lastHoveredSquareElementDuringDrag; 

        function handleSquareHoverEffect(event) { 
            if (event.type === "touchmove" && !isActiveTouch(event)) return;

            var targetElement = getEventTarget(event);
            if (targetElement !== lastHoveredSquareElementDuringDrag && !isChordInProgress) {
                var pressClass = "square open0";
                var normalClassForMarked = "square questionpressed";
                var resetClass = "square blank";
                var resetClassForMarked = "square question";

                if (isRightMouseDown) { 
                    if (lastHoveredSquareElementDuringDrag && squareCacheById[lastHoveredSquareElementDuringDrag.id]) {
                        updateNeighborSquaresClassOnHover(squareCacheById[lastHoveredSquareElementDuringDrag.id], resetClass, resetClassForMarked);
                    }
                    if (isElementASquare(targetElement) && squareCacheById[targetElement.id]) {
                        updateNeighborSquaresClassOnHover(squareCacheById[targetElement.id], pressClass, normalClassForMarked);
                    }
                } else { 
                    if (lastHoveredSquareElementDuringDrag && squareCacheById[lastHoveredSquareElementDuringDrag.id]) {
                        updateSquareClassOnHover(squareCacheById[lastHoveredSquareElementDuringDrag.id], resetClass, resetClassForMarked);
                    }
                    if (isElementASquare(targetElement) && squareCacheById[targetElement.id]) {
                        updateSquareClassOnHover(squareCacheById[targetElement.id], pressClass, normalClassForMarked);
                    }
                }
            }
            lastHoveredSquareElementDuringDrag = isElementASquare(targetElement) ? targetElement : undefined;
        }
        
        function handleFaceHoverEffect(event) { 
            if (event.type === "touchmove" && !isActiveTouch(event)) return;
            var targetElement = getEventTarget(event);
            var faceEl = document.getElementById("face");
            if (faceEl) { 
                 faceEl.className = (targetElement.id === "face") ? "facepressed" : "facesmile";
            }
        }

        function getEventTarget(event) {
            if (event.type === "touchmove" || event.type === "touchend") {
                var touch = event.originalEvent.changedTouches[0];
                return document.elementFromPoint(touch.clientX, touch.clientY);
            } else {
                return event.target;
            }
        }
        
        function isActiveTouch(event) {
            if (activeTouchIdentifier === null) return false;
            return event.originalEvent.changedTouches[0].identifier === activeTouchIdentifier;
        }

        isIE7OrLess = $.browser.msie && parseFloat($.browser.version) <= 7;

        $(document).bind("gesturestart", function(event) {
            isGestureInProgress = true;
            clearTouchState();
        });
        $(document).bind("gestureend", function(event) {
            isGestureInProgress = false;
        });
        $(document).bind("scroll", clearTouchState); 

        function clearTouchState() {
            if (activeTouchIdentifier === null) return;
            activeTouchIdentifier = null;
            var faceEl = document.getElementById("face");
            if (lastHoveredSquareElementDuringDrag && squareCacheById[lastHoveredSquareElementDuringDrag.id]) {
                updateSquareClassOnHover(squareCacheById[lastHoveredSquareElementDuringDrag.id], "square blank", "square question");
                lastHoveredSquareElementDuringDrag = undefined;
            }
            if (!isGameOver && faceEl) {
                faceEl.className = "facesmile";
            }
        }

        $(document).bind("touchstart", function(event) {
            $(document).unbind("mousedown").unbind("mouseup"); 
            if (activeTouchIdentifier || isGestureInProgress) return; 

            activeTouchIdentifier = event.originalEvent.changedTouches[0].identifier;
            var targetElement = event.target;
            var faceEl = document.getElementById("face");


            if (isElementASquare(targetElement) && !isGameOver) {
                var touchId = activeTouchIdentifier; 
                var squareElement = targetElement;   
                
                setTimeout(function() {
                    if (touchId === activeTouchIdentifier && squareElement === lastHoveredSquareElementDuringDrag) {
                        if(squareCacheById[squareElement.id]) squareCacheById[squareElement.id].flag(true); 
                        activeTouchIdentifier = null; 
                        if(!isGameOver && faceEl) faceEl.className = "facesmile";
                    }
                }, 500); 

                $(document).bind("touchmove", handleSquareHoverEffect);
                if(faceEl) faceEl.className = "faceooh";
                lastHoveredSquareElementDuringDrag = undefined; 
                handleSquareHoverEffect(event); 
            } else if (targetElement.id === "face") {
                isFacePressed = true;
                $(document).bind("touchmove", handleFaceHoverEffect); 
                if(faceEl) faceEl.className = "facepressed";
            }
        });

        $(document).bind("touchend", function(event) {
            if (!isActiveTouch(event)) return;
            
            var currentActiveTouch = activeTouchIdentifier; 
            activeTouchIdentifier = null; 
            var faceEl = document.getElementById("face");


            $(document).unbind("touchmove", handleSquareHoverEffect).unbind("touchmove", handleFaceHoverEffect);
            if ((isFacePressed || !isGameOver) && faceEl) {
                faceEl.className = "facesmile";
            }

            var targetElement = getEventTarget(event);
            if (isElementASquare(targetElement) && !isGameOver && currentActiveTouch !== null) { 
                var square = squareCacheById[targetElement.id];
                if (!square) return; 

                if (!hasGameStartedPlaying) {
                    var squareType = handleFirstClickSafety(square); 
                    hasGameStartedPlaying = true;
                }

                if (square.isRevealed()) {
                    square.reveal9(); 
                } else if (square.isFlagged()) {
                    square.flag(true); 
                } else {
                    if (!square.reveal1()) { 
                        handleLoss([square]); 
                    }
                }
                event.preventDefault();
            } else if (targetElement.id === "face" && isFacePressed) {
                self.newGame();
            }
            isFacePressed = false;
        });

        $(document).mousedown(function(event) {
            var mouseButtons = getMouseButtonStates(event);
            isLeftMouseDown = mouseButtons.left || isLeftMouseDown;
            isRightMouseDown = mouseButtons.right || isRightMouseDown;
            var targetElement = event.target;
            var faceEl = document.getElementById("face");


            if (event.ctrlKey && isElementASquare(targetElement) && !isGameOver) {
                if(squareCacheById[targetElement.id]) squareCacheById[targetElement.id].flag(); 
                isMouseDownForCtrlClick = true; 
            } else if (isLeftMouseDown) {
                if (isElementASquare(targetElement) && !isGameOver) {
                    event.preventDefault(); 
                    $(document).bind("mousemove", handleSquareHoverEffect);
                    if(faceEl) faceEl.className = "faceooh";
                    lastHoveredSquareElementDuringDrag = undefined;
                    handleSquareHoverEffect(event); 
                } else if (targetElement.id === "face") {
                    event.preventDefault();
                    isFacePressed = true;
                    $(document).bind("mousemove", handleFaceHoverEffect);
                    if(faceEl) faceEl.className = "facepressed";
                }
            } else if (isRightMouseDown) { 
                 if (isElementASquare(targetElement) && !isGameOver) {
                    if(squareCacheById[targetElement.id]) squareCacheById[targetElement.id].flag();
                 }
            }
        });
        
        $(document).on("contextmenu", function(event) {
            var $target = $(event.target);
            if ($target.is("#game") || $target.closest("#game").length > 0) {
                 event.preventDefault(); 
                 return false;
            }
        });

        $(document).mouseup(function(event) {
            var mouseButtons = getMouseButtonStates(event);
            var square, squareType;
            var faceEl = document.getElementById("face");


            if (isMouseDownForCtrlClick) { 
                isLeftMouseDown = false;
                isRightMouseDown = false;
                isMouseDownForCtrlClick = false;
                return;
            }

            if (mouseButtons.left) { 
                isLeftMouseDown = false;
                $(document).unbind("mousemove", handleSquareHoverEffect).unbind("mousemove", handleFaceHoverEffect);
                
                if ((isFacePressed || !isGameOver) && faceEl) { 
                    faceEl.className = "facesmile";
                }

                if (isElementASquare(event.target) && !isGameOver) {
                    square = squareCacheById[event.target.id];
                    if(!square) return;

                    if (isRightMouseDown) { 
                        isChordInProgress = true; 
                        updateNeighborSquaresClassOnHover(square, "square blank", "square question"); 
                        square.reveal9();
                    } else { 
                        if (!isChordInProgress) { 
                            if (!hasGameStartedPlaying) {
                                squareType = handleFirstClickSafety(square);
                                hasGameStartedPlaying = true;
                            }
                            if (!square.reveal1()) { 
                                handleLoss([square]);
                            }
                        }
                    }
                    isChordInProgress = false; 
                } else if (event.target.id === "face" && isFacePressed) {
                    self.newGame();
                }
                isFacePressed = false;
            }

            if (mouseButtons.right) { 
                isRightMouseDown = false;
                if (isElementASquare(event.target) && !isGameOver) {
                    square = squareCacheById[event.target.id];
                    if(!square) return;

                    if (isLeftMouseDown) { 
                        isChordInProgress = true;
                        updateNeighborSquaresClassOnHover(square, "square blank", "square question"); 
                        square.reveal9();
                    } 
                    isChordInProgress = false; 
                }
                 if (!isGameOver && faceEl) { 
                    faceEl.className = "facesmile";
                }
            }
        });

        $(document).keydown(function(event) {
            var square;
            var faceEl = document.getElementById("face");

            if (event.which === 113) { // F2 for new game
                self.newGame();
            } else if (event.which === 32) { // Space bar
                if (hoveredSquareId && !isGameOver && squareCacheById[hoveredSquareId]) {
                    square = squareCacheById[hoveredSquareId];
                    if (square.isRevealed()) {
                        square.reveal9(); 
                    } else {
                        square.flag();    
                    }
                }
                event.preventDefault(); 
            } else if (event.which === 90 && !event.shiftKey && isCtrlOrCmd(event)) { // Ctrl+Z or Cmd+Z
                if (faceEl && faceEl.className === "facedead" && lastGoodGridState) {
                    self.newGame(lastGoodGridState, { time: timer.getTime() }); 
                }
            }
        });
        
        function isCtrlOrCmd(event) {
            var isMac = window.navigator && window.navigator.platform && window.navigator.platform.toLowerCase().indexOf("mac") !== -1;
            return isMac ? event.metaKey : event.ctrlKey;
        }

        $("#game").mouseover(function(event) {
            if (isElementASquare(event.target)) {
                hoveredSquareId = event.target.id;
            }
        });
        $("#game").mouseout(function(event) {
            if (isElementASquare(event.target)) {
                if (hoveredSquareId === event.target.id) { 
                    hoveredSquareId = "";
                }
            }
        });
    } 
}
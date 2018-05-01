const Chess = require("chess.js").Chess;

var chess = new Chess();

/**
 * Uses Monte Carlo Tree Search
 */
class MonteCarloPlayer {

  getNextMove(moves) {
    var legalMoves = this.getLegalMoves(moves);
    var mates = legalMoves.filter(move => /\#/.test(move.san));
    var checks = legalMoves.filter(move => /\+/.test(move.san));

    if (mates.length) {
      return this.getRandomMove(mates);
    }
    //
    // if (checks.length) {
    //   return this.getRandomMove(checks);
    // }

    const NUM_SIMULATIONS = 100;
    //TODO: FIX ---- Moves are a space separated string!!!!!
    if (legalMoves.length) {
      let bestRatio = 0;
      let bestMove = "";
      legalMoves.forEach(move => {
        let opponentsMoves = legalMoves.slice();
        opponentsMoves.push(move);
        let opponentsLegalMoves = this.getLegalMoves(opponentsMoves);
        if (!opponentsLegalMoves.length) {
          console.log("End of game!!!")
        }
        let worstRatio = 1;
        let worstMove = "";
        opponentsLegalMoves.forEach(opponentMove => {
          let numWins = 0;
          let numGames;
          for (numGames = 0; numGames < NUM_SIMULATIONS; numGames++) {
            numWins += this.simulate(moves, move, false, 5);
          }
          console.log("Number of wins = " + numWins);
          console.log("Number of games = " + numGames);
          let winRatio = numWins / numGames;
          if (winRatio < worstRatio) {
            worstRatio = winRatio;
            worstMove = opponentMove;
          }
        });
        if (worstRatio > bestRatio) {
          bestRatio = worstRatio;
          bestMove = worstMove;
        }

      });
      console.log("Best move")
      console.log(bestMove)
      return bestMove;
      //return this.getRandomMove(legalMoves);
    }
  }

  simulate(movesSoFar, move, isAIsTurn, depth) {
    var legalMoves = this.getLegalMoves(movesSoFar);
    var mates = legalMoves.filter(move => /\#/.test(move.san));
    var checks = legalMoves.filter(move => /\+/.test(move.san));

    if (depth <= 0) {
      return 0.5;
    } else if (mates.length && isAIsTurn) {
      return 1;
    } else if (mates.length) {
      return 0;
    } else {
      return 0.5;
      // let newMovePath = legalMoves.slice();
      // newMovePath.push(move);
      // return this.simulate(newMovePath, this.getRandomMove(newMovePath), !isAIsTurn, depth--);
    }
  }

  getReply(chat) {
    return "hi";
  }

  getLegalMoves(moves) {
    chess.reset();
    moves.forEach(move => chess.move(move, { sloppy: true }));
    return chess.moves({ verbose: true });
  }

  getRandomMove(moves) {
    var move = moves[Math.floor(Math.random() * moves.length)];
    return move.from + move.to + (move.flags === "p" ? move.piece : "");
  }
}

module.exports = MonteCarloPlayer;

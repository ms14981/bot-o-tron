const ChessUtils = require("../utils/ChessUtils");


/**
 * Performs MCTS
 */
class MonteCarloPlayer {

  getNextMove(moves) {
    const chess = new ChessUtils();
    chess.applyMoves(moves);
    const legalMoves = chess.legalMoves();
    const forcing = chess.filterForcing(legalMoves);
    const captures = legalMoves.filter(move => /x/.test(move.san));

    const NUM_SIMULATIONS = 100;
    console.log(chess)
    // TODO: Write function to deep copy 'chess', equivalent to deep copying history
    console.log(chess.history())
    return chess.pickRandomMove(legalMoves);

    let AIPlayerColour = chess.turn();
    let bestScore = 0;
    let bestMove = legalMoves[0];
    legalMoves.forEach(move => {
      console.log("Looking at:")
      console.log(move.san)
      let newMoves = moves.concat(move);
      chess.move(move, { sloppy: true })
      if (chess.inCheckmate()) {
        return chess.uci(move);
      }
      const opponentLegalMoves = chess.legalMoves();
      let worstScore = 1;
      let worstMove = opponentLegalMoves[0];
      opponentLegalMoves.forEach(newMove => {
        // chess.move(newMove, {sloppy:true});
        let numWins = 0.0;
        let depthLimit = 100;
        for (let i = 0; i < NUM_SIMULATIONS; i++) {

          let results = this.simulateUntilGameover(chess, newMove, false, depthLimit, 0);
          // numWins += results[0];
          // let numMovesToUndo = results[1];
          // for (let j = 0; j < numMovesToUndo; j++) {
          //   chess.undo();
          // }
          //console.log(numWins)
        }
        console.log(numWins);

        let score = numWins / NUM_SIMULATIONS;
        if (score < worstScore) {
          worstScore = score;
          worstMove = newMove;
        }
        //chess.undo();
        // chess.reset();
        // chess.applyMoves(moves)
      });
      chess.reset();
      chess.applyMoves(moves)
      if (worstScore > bestScore) {
        bestScore = worstScore;
        bestMove = move;
      }
      console.log(worstScore)
    });
    return chess.uci(bestMove);

    // if (forcing.length) {
    //   return chess.pickRandomMove(forcing);
    // }
    //
    // if (captures.length) {
    //   return chess.pickRandomMove(captures);
    // }

    if (legalMoves.length) {
      return chess.pickRandomMove(legalMoves);
    }
  }

  simulateUntilGameover(chess, move, isAiTurn, depthLimit, currentDepth) {
    if (chess.inCheckmate()) {
      // console.log("Simulating")
      // console.log(move)
    }
    // if (chess.inGameOver()) {
    //   console.log("Simulating")
    //   console.log(move)
    // }

    chess.move(move, { sloppy: true });
    currentDepth++;
    if (chess.inCheckmate() && isAiTurn) {
      return [1, currentDepth];
    } else if (chess.inCheckmate()) {
      return [0, currentDepth];
    } else if (chess.inDraw() || depthLimit <= 0) {
      return [0.5, currentDepth];
    } else {
      chess.move(move, { sloppy: true });
      const legalMoves = chess.legalMoves();
      let randomMove = legalMoves[Math.floor(Math.random()*legalMoves.length)];
      depthLimit--;
      return [this.simulateUntilGameover(chess, randomMove, !isAiTurn, depthLimit), currentDepth];
    }
  }

  getReply(chat) {
    return "hi";
  }

}

module.exports = MonteCarloPlayer;

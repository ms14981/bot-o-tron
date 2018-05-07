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

    const NUM_SIMULATIONS = 1;

    let AIPlayerColour = chess.turn();
    console.log(chess)
    let bestScore = 0;
    let bestMove = legalMoves[0];
    legalMoves.forEach(move => {
      console.log("Looking at:")
      console.log(move)
      let newMoves = moves.concat(move);
      chess.move(move, { sloppy: true })
      if (chess.inCheckmate()) {
        return chess.uci(move);
      }
      const opponentLegalMoves = chess.legalMoves();
      let worstScore = 1;
      let worstMove = opponentLegalMoves[0];
      opponentLegalMoves.forEach(newMove => {
        //chess.move(newMove, {sloppy:true});
        if (chess.inCheckmate()) {
          return chess.uci(move);
        }
        let numWins = 0.0;
        if (!chess.inCheckmate()) {
          for (let i = 0; i < NUM_SIMULATIONS; i++) {
            numWins += this.simulateUntilGameover(chess, newMove, false, 10);
            //console.log(numWins)
          }
        }

        let score = numWins / NUM_SIMULATIONS;
        if (score < worstScore) {
          worstScore = score;
          worstMove = newMove;
        }
        chess.undo();
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

  simulateUntilGameover(chess, move, isAiTurn, depthLimit) {
    if (chess.inCheckmate()) {
      console.log("Simulating")
      console.log(move)
    }
    chess.move(move, { sloppy: true });
    if (chess.inCheckmate() && isAiTurn) {
      return 1;
    } else if (chess.inCheckmate()) {
      return 0;
    } else if (chess.inDraw() || depthLimit <= 0) {
      return 0.5;
    } else {
      const legalMoves = chess.legalMoves();
      let randomMove = legalMoves[Math.floor(Math.random()*legalMoves.length)];
      return this.simulateUntilGameover(chess, randomMove, !isAiTurn, depthLimit--);
    }
  }

  getReply(chat) {
    return "hi";
  }

}

module.exports = MonteCarloPlayer;

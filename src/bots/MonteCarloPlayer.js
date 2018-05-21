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
    const DEPTH_LIMIT = 10;

    let chosenMove = legalMoves[0];
    let bestScore = 0;

    legalMoves.forEach(aiMove => {
      chess.move(aiMove);
      console.log(aiMove);
      //console.log(chess.history()[chess.history().length - 1])
      let score = 0;
      for (let i = 0; i < NUM_SIMULATIONS; i++) {
        let chessCopy = this.getDeepCopy(chess);
        let result = this.simulateUntilGameover(chessCopy, DEPTH_LIMIT);
        score += result;
        // console.log(chessCopy.history()[chessCopy.history().length - 1])
        // console.log(result)
      }
      score /= NUM_SIMULATIONS;
      if (score > bestScore) {
        bestScore = score;
        chosenMove = aiMove;
        console.log("-------------------")
        console.log(score);
      }
      chess.undo();
    })

    return chess.uci(chosenMove);
  }

  getDeepCopy(chess) {
    let newChess = new ChessUtils();
    newChess.applyMoves(chess.history({ verbose: true }));
    return newChess;
  }

  simulateUntilGameover(chess, depthLimit) {
    let history = chess.history();
    let isAiTurn = true;

    while (!chess.inCheckmate() && !chess.inDraw() && depthLimit > 0) {
      //console.log(chess.legalMoves().length);
      let moves = chess.legalMoves();
      let randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
      isAiTurn = !isAiTurn;
      depthLimit--;
    }
    if (chess.inCheckmate() && isAiTurn) {
      return 1;
    } else if (chess.inCheckmate()) {
      return 0;
    } else {
      return 0.5;
    }
  }

  getReply(chat) {
    return "hi";
  }

}

module.exports = MonteCarloPlayer;

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
    const baselineHistory = chess.history().slice();

    let chosenMove = legalMoves[0];

    console.log(baselineHistory);
    console.log(legalMoves[0]);

    for (let i = 0; i < NUM_SIMULATIONS; i++) {
      let chessCopy = this.getDeepCopy(chess);
      let result = this.simulateUntilGameover(chessCopy);
      console.log(chessCopy.history()[chessCopy.history().length - 1])
      console.log(result)
    }


    return chess.uci(chosenMove);
  }

  getDeepCopy(chess) {
    let newChess = new ChessUtils();
    newChess.applyMoves(chess.history({ verbose: true }));
    return newChess;
  }

  simulateUntilGameover(chess) {
    let history = chess.history();
    let isAiTurn = true;

    while (!chess.inCheckmate() && !chess.inDraw()) {
      //console.log(chess.legalMoves().length);
      let moves = chess.legalMoves();
      let randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
      isAiTurn = !isAiTurn;
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

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

    this.simulateUntilGameover(chess);

    return chess.uci(chosenMove);
  }

  simulateUntilGameover(chess) {
    let history = chess.history();

    while (!chess.inCheckmate() && !chess.inDraw()) {
      console.log(chess.legalMoves().length);
      let moves = chess.legalMoves();
      let randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
    }
    if (chess.inCheckmate()) {
      return 1;
    } else {
      return 0.5;
    }
  }

  getReply(chat) {
    return "hi";
  }

}

module.exports = MonteCarloPlayer;

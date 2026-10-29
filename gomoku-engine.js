(function(root){
'use strict';
const SIZE=15;
function create(players){if(players.length!==2||!players[0]||!players[1]||players[0]===players[1])throw Error('需要两位不同的玩家');return {board:Array(SIZE*SIZE).fill(0),players:[...players],turn:0,phase:'playing',winner:null,last:null};}
function move(game,id,row,col){if(game.phase!=='playing'||game.players[game.turn]!==id||!Number.isInteger(row)||!Number.isInteger(col)||row<0||row>=SIZE||col<0||col>=SIZE)return false;const idx=row*SIZE+col;if(game.board[idx]!==0)return false;const stone=game.turn+1;game.board[idx]=stone;game.last={row,col};for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){let count=1;for(const sign of [-1,1]){let r=row+dr*sign,c=col+dc*sign;while(r>=0&&r<SIZE&&c>=0&&c<SIZE&&game.board[r*SIZE+c]===stone){count++;r+=dr*sign;c+=dc*sign}}if(count>=5){game.phase='finished';game.winner=id;return true}}if(game.board.every(Boolean)){game.phase='finished';return true}game.turn=1-game.turn;return true}
root.Gomoku={SIZE,create,move};if(typeof module!=='undefined')module.exports=root.Gomoku;
})(typeof globalThis!=='undefined'?globalThis:this);

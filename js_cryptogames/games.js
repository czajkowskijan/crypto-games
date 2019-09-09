import { Primitive, RandomFun } from './primitives.js';
import { randBitString } from './support.js';

//Module containing definitions of the cryptographic games

export class Game {
    // class representing a cryptographic game, like PrivK^{eav}_{A,Pi}, 
    // where A is the adversary played by the user, Pi is the primitive, for which the game is played

    constructor () {
      this.pi = new Primitive(); // Primitive in the game: Enc_k, PRG, random string, PRF, random function
      this.oracle = false; //Is there oracle access to the primitive
      this.bit = false; // False: random function/string or m_0, True: pseudorandom function/string or m_1
      this.phase = false; // False-learning phase, True-challenge phase
    }
    get Phase(){
      return this.phase;
    }
    set Phase(bul){
      this.phase = bul;
    }

    oracleCall(x) {
        if( this.oracle == true) {
            return this.pi.eval(x);
        } else{
            alert("No oracles here");
          }
    }

    challenge(bul){
      if(this.bit == bul){
        return true;
      } else{
        return false;
      }
    }
}

export class PRF extends Game {
  // Security game for PRFs
  constructor (n, prf){
    super();
    if (arguments.length == 0) { 
        this.oracle = true;
        this.n = 1;
    }
    if (arguments.length == 2) {
      this.n = n;
      this.oracle = true;
      this.bit =  Math.floor(Math.random() * 2 );
      if (this.bit == false){
        var randfun = new RandomFun(n,n);
        this.pi = randfun;
      }
      else {
        this.pi = prf;
      }
    }
  }
}



export class PRG extends Game {
  // Security game for PRGs
  constructor(n,l,prg){
    super();
    if (arguments.length == 0) { 
        this.oracle = false;
        this.n = 1;
        this.l = 2;
        this.w = "00"; // the output of the PRG or a random string
        this.phase = true;
    }
    if (arguments.length == 3) {
      this.n = n;
      this.l = l;
      this.oracle = false;
      this.phase = true;
      this.bit =  Math.floor(Math.random() * 2 );
      if (this.bit == false){
        var randstring = randBitString(l);
        this.w = randstring;
      }
      else {
        var seed = randBitString(n);
        this.w = prg.eval(seed);
      }
    }

  }
  get wstring() {
      return this.w;
    }
}

export class PrivKEav extends Game {
  constructor(k,n,enc){
    super();
    if (arguments.length == 0) {
        this.oracle = false;
        this.k = 1;
        this.n = 1;
    }
    if (arguments.length == 3) {
      this.k = k; // Security parameter
      this.n = n; // Message length
      this.oracle = false;
      this.bit =  Math.floor(Math.random() * 2 );
      this.pi = enc;
    }
  }
  chCipher (msgs) {
    // m: array of strings
    this.phase = true;
    var m = msgs[parseInt(this.bit)];
    return this.pi.eval(m);
  }
}

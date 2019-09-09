import { validInput, randBitString, sxor } from './support.js';

//Module containing definitions of cryptographic primitives (functions) use in cryptogames

export class Primitive {
    // A general class for functions, encryption subroutines, etc.

    constructor (){
        this.inlen = 1;
        this.outlen = 1;
    }
    get Inlen(){
        return this.inlen;
    }
    set Inlen(m){
        this.inlen = m;
    }
}

export class RandomFun extends Primitive {
    // A random function f: {0,1}^n -> {0,1}^m

    constructor (n, m, database){
        super();
        if(arguments.length == 2){
            this.inlen = n;
            this.outlen = m;
            var dict = {};
            this.database = dict;
        }
        if(arguments.length == 3){
            this.inlen = n;
            this.outlen = m;
            this.database = database;
        }
    }

    eval(x) {
        if ( validInput(x, this.inlen) ){
            if (x in this.database){
                return this.database[x];
            }
            else {
                var y = randBitString(this.outlen);
                this.database[x] = y;
                return y;
            }
        }
    }
}

export class XorFun extends Primitive{
    //Simple function xsoring the input with the key

    constructor(n){
        super();
        if (arguments.length == 0) { 
            this.inlen = 1;
            this.outlen = 1;
            this.key = "0";
        }
        if (arguments.length == 1) {
            this.inlen = n;
            this.outlen = n;
            this.key = randBitString(this.inlen);
        }
    }

    eval(x){
        if (validInput(x, this.inlen)){
            return sxor(x, this.key)
        }
    }

    describe(){
        return "F_k(x):= k XOR x";
    }
}

export class ConcG extends Primitive {
    constructor(n) {
        super();
        if (arguments.length == 0) { 
            this.inlen = 1;
            this.outlen = 2;
        }
        if (arguments.length == 1) {
            this.inlen = n;
            this.outlen = 2*n;
        }
    }

    eval(s) {
        if (validInput(s, this.inlen)){
            return s.concat(s);
        }
    }

    describe(){
        return "G(s):= s || s";
    }
}

export class Vigenere extends Primitive {
    // key of length k, xors to messages of length n and wraps aorund longer messages
    constructor(n, k){
        super();
        if (arguments.length == 0) { 
            this.inlen = 1;
            this.outlen = 1;
            this.key = "0";
        }
        if (arguments.length == 2) {
            this.inlen = n;
            this.outlen = n;
            this.key = randBitString(k);
            this.keylong = "";
            if (k >= n){
                this.keylong = this.key.substring(0,n);
            }
            else{
                while (this.keylong.length < this.inlen) {
                    this.keylong += this.key;
                }
                this.keylong = this.keylong.substring(0,this.inlen);
            }
        }
    }

    eval(x){
        if (validInput(x, this.inlen)){
            return sxor(x, this.keylong)
        }
    }

    describe(){
        return "Enc_k(m):= m XOR k||k||...||k";
    }
}     
        
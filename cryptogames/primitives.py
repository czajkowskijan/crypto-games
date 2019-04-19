import random, string 
from cryptogames.support import validInput

class Primitive():
    """A general class for functions, encryption subroutines, etc."""
    inlen = 1
    outlen = 1

class RandomFun(Primitive):
    """A random function f: {0,1}^n -> {0,1}^m"""
    database = dict()

    def __init__(self, n, m, database):
        self.inlen = n
        self.outlen = m
        self.database = database

    def eval(self, x):
        if validInput(x, self.inlen):
            if x in self.database:
                return self.database[x]
            else:
                # y = ''.join(random.choice('01') for i in range(self.outlen))
                secure_random = random.SystemRandom()
                y = ''.join(secure_random.choice('01') for i in range(self.outlen))
                self.database[x] = y
                return y
        
class XorFun(Primitive):
    """docstring for XorFun"""
    key = '0'

    def __init__(self, n):
        self.inlen = n
        self.outlen = n
        self.key = ''.join(random.choice('01') for i in range(self.inlen))

    def eval(self, x):
        if validInput(x, self.inlen):
            return sxor(x, self.key)

    def describe(self):
        return "F_k(x):= k XOR x"

class ConcG(Primitive):
    """docstring for XorFun"""

    def __init__(self, n, l):
        self.inlen = n
        self.outlen = l

    def eval(self, s):
        if validInput(s, self.inlen):
            return ''.join( (s,s) )

    def describe(self):
        return "G(s):= s || s"


        
        
import random, string
from cryptogames.primitives import RandomFun


class Game():
    """class representing a cryptographic game, like PrivK^{eav}_{A,Pi}, where A is the adversary played by the user, Pi is the primitive, for which the game is played"""
    pi = None # Primitive in the game: Enc_k, PRG, random string, PRF, random function
    oracle = False # Is there oracle access to the primitive
    bit = False # False: random function/string or m_0, True: pseudorandom function/string or m_1

    phase = False # False-learning phase, True-challenge phase

    def oracleCall(self, x):
        if self.oracle == True:
            return self.pi(x)
        else:
            msg = "No oracles here"
            print(msg)

    def setPhase(self, bul):
        self.phase = bul

    def getPhase(self):
        return self.phase

    def challenge(self, b):
        if self.bit == b:
            return True, "You won!"
        else:
            return False, "You lose"

class PRF(Game):
    """Security game for PRFs"""
    oracle = True
    n = 1

    def __init__(self, n, prf):
        self.n = n
        self.bit = random.choice([True, False])
        if self.bit == False:
            randfun = RandomFun(n,n,{})
            self.pi = randfun.eval
        else:
            fun = prf(n)
            self.pi = fun.eval

class PRG(Game):
    """Security game for PRGs"""
    oracle = False
    n = 1
    l = 2

    def __init__(self, n, l, prg):
        self.n = n
        self.l = l
        self.bit = random.choice([True, False])
        if self.bit == False:
            randstring = ''.join(random.choice('01') for i in range(self.l))
            self.pi = randstring
        else:
            seed = ''.join(random.choice('01') for i in range(self.n))
            gens = prg.eval(seed)
            self.pi = gens
        
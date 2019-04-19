import random, string

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
            print msg

    def setPhase(self, bul):
        self.phase = bul

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

def stIsBin(string):
    for character in string:
        if character != '0' and character != '1':
            return False
    return True

def sxor(s1,s2):
    """ convert strings to a list of character pair tuples
        go through each tuple, converting them to integers
        perform exclusive or on them
        then convert the result back to a string
        merge the resulting array of characters as a string
    """
    if stIsBin(s1) and stIsBin(s2):
        if len(s1)==len(s2):
            return ''.join(str( int(a) ^ int(b) ) for a,b in zip(s1,s2))
        else:
            msg = "Inputs are not equal length"
            print msg
    else:
        msg = "Inputs are not bitstrings"
        print msg

def validInput(x, n):
    if len(x) != n:
        msg = "Input length wrong"
        print msg
        return False
    if not stIsBin(x):
        msg = "Input is not a bitstring"
        print msg
        return False
    return True
            
# Initialize, n-input length    
n = 5
prf = PRF(n, XorFun)


print "Let's play the PRF game!", "Lengths of inputs is: ", n
print "The pseudorandom function is: ", XorFun(n).describe()
print "Write 'challenge' to go to challenge phase."
while prf.phase == False:
    print "Make oralce calls: "
    x = raw_input()
    if not x == "challenge":
        print prf.oracleCall(str(x))
    else:
        prf.setPhase(True)
print "Ok, what's the verdict? '0' for a random function, '1' for the pseudorandom function."
b = input()
print prf.challenge(b)
        
        
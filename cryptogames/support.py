import string 

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
            print(msg)
    else:
        msg = "Inputs are not bitstrings"
        print(msg)

def validInput(x, n):
    if len(x) != n:
        msg = "Input length wrong"
        print(msg)
        return False
    if not stIsBin(x):
        msg = "Input is not a bitstring"
        print(msg)
        return False
    return True
            

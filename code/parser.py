### title: pseudo to html converter
### author: tom moshaiov
### date: 3.12.21
### comments: tis but a script
### acknowledgments: stackoverflow

### pseudo grammar includes:
#   latex macros via the symbol \
#   eg \R for real numbers
#   html macros via the symbol #
#   eg #beginproof
#   parameters via {}
#   eg #topic{modular arithmetic}


### program inputs: path to pseudo source, path to html destination
### compile with: $python3 pseudo2html.py {path.to.pseudo} {path.to.html}
### e.g. $python3 pseudo2html.py mnt/c/Users/.../page.pseudo mnt/c/Users/.../page.html

import re
import os
import random
import string
import sys


macros = {
"Z" : "\\mathbf{Z}",
"R" : "\\mathbf{R}",
"Q" : "\\mathbf{Q}",
"C" : "\\mathbf{C}",
"End" : "\\text{End}",
"span" : "\\text{span}"
}



fncDict = {
    "comment" : lambda x : "\n<!-- comment.\n{}\nendcomment-->\n".format(x),
    "blue" : lambda x : "<dfn> {} </dfn>".format(x),
    "topic" : lambda x : "<!-- topic -->\n<h1> {} </h1>\n".format(x),
    "proof" : lambda rand,x : "\n<!-- beginproof -->\n\t <hr> <button onclick=\"show_hide(\'{}\')\">proof. </button> <div id=\"{}\" style=\"display: none;\">\n {} \n\t<span style=\"float:right;\"> ▨ </span> </div>\n<!-- endproof -->\n".format(rand,rand,x),
    "dfn" : lambda x : "<hr>\ndefinition." if x=="" else "<hr>\ndefinition ["+x+"].",
    "claim" : lambda x : "<hr>\nclaim." if x=="" else "<hr>\nclaim ["+x+"].",
    "lemma" : lambda x : "<hr>\nlemma." if x=="" else "<hr>\nlemma ["+x+"].",
    "theorem" : lambda x : "<hr>\ntheorem." if x=="" else "<hr>\ntheorem ["+x+"].",
    "norm" : lambda x : "\\left\\lVert {} \\right\\rVert".format(x)
}

### ASSUMPTION: all # will be followed by ...{...}
def open_and_closing_idx(string,hash_idx):
    i=hash_idx
    while string[i]!="{":
        i+=1
    openIdx=i
    num_opened=1
    while num_opened>0:
        i+=1
        if string[i]=="{":
            num_opened+=1
        if string[i]=="}":
            num_opened-=1
    return openIdx,i

def getFunctionNameAndInput(string,hash_idx):
    openIdx, closeIdx = open_and_closing_idx(string,hash_idx)
    name=string[hash_idx+1:openIdx]
    var=string[openIdx+1:closeIdx]
    return name, var

def getRandomString(N=10):
    return "".join(random.choice(string.ascii_uppercase) for _ in range(N))

def doFunction(string,hash_idx,closing_bracket_idx):
    fncName, var = getFunctionNameAndInput(string,hash_idx)
    fnc = fncDict[fncName]
    if fncName!="proof":
        fncReplacement = fnc(var)
    else:
        rnd=getRandomString()
        fncReplacement=fnc(rnd,var)
    
    return string[:hash_idx]+fncReplacement+string[closing_bracket_idx+1:]

def doSomeFunction(string):
    for x in range(len(string)):
        if string[x]=="#":
            closing_bracket_idx=open_and_closing_idx(string,x)[1]           
            return doFunction(string,x,closing_bracket_idx)
    return "already HTML"

def doAllFunctions(string):
    string=string.replace("#newline","\n<hr>\n")

    while doSomeFunction(string) != "already HTML":
        string=doSomeFunction(string)
    return string

begindoc = """<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/x-mathjax-config"> MathJax.Hub.Config({ tex2jax: { inlineMath: [ ['$','$'], ["\\(","\\)"] ], processEscapes: true }});</script>
    <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"> </script>
    <link rel="stylesheet" href="main.css">
    <script src="main.js"></script>
</head>
<body>

"""

enddoc = """

</body>
</html>"""

def pseudo2HTML(string):
    string=doAllFunctions(string)

    for macro in macros:
        rep="\\"+macro
        by=macros[macro]
        string=string.replace(rep,by)

    string=begindoc+string+enddoc
    return string

path2pseudo=sys.argv[1]
path2html=sys.argv[2]

with open(path2pseudo,"r") as src:
    pseudo=src.read()
    F=open(path2html,"w")
    F.write(pseudo2HTML(pseudo))

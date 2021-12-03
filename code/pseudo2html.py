### title: pseudo to html converter
### author: tom moshaiov
### date: 3.12.21
### comments: tis but a script

### pseudo grammar includes:
#   latex macros via the symbol %
#   html macros via the symbol #

### program inputs: path to pseudo source, path to html destination
### compile with: $python3 pseudo2html.py {path.to.pseudo} {path.to.html}
### e.g. $python3 pseudo2html.py mnt/c/Users/.../page.pseudo mnt/c/Users/.../page.html

import re
import os
import random
import string
import sys

macros = {
"Z" : "\mathbf{Z}",
"R" : "\mathbf{R}",
"Q" : "\mathbf{Q}",
"C" : "\mathbf{C}",
}

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

N=10
def getRandomString():
    return "".join(random.choice(string.ascii_uppercase) for _ in range(N))

def beginproof(matchobj):
    proofId=getRandomString()
    ret = """
<!-- beginproof -->
    <hr> <button onclick=\"show_hide(\'"""+proofId+"""\')\">proof. </button> <div id=\""""+proofId+"""\" style=\"display: none;\">
"""
    return ret
    
endproof = """
    <span style="float:right;"> ▨ </span> </div> <hr>
<!-- endproof -->
"""

begincomment = "\n<!-- comment."

endcomment = "-->\n"

def pseudo2HTML(string):
    string=begindoc+string+enddoc
    string=re.sub("#beginproof",beginproof,string)
    string=string.replace("#endproof",endproof)
    string=string.replace("#begincomment",begincomment)
    string=string.replace("#endcomment",endcomment)
    string=string.replace("#newline","<hr>")

    for macro in macros:
        rep="%"+macro
        by=macros[macro]
        string=string.replace(rep,by)
    return string


path2pseudo=sys.argv[1]
path2html=sys.argv[2]

with open(path2pseudo,"r") as src:
    pseudo=src.read()
    F=open(path2html,"w")
    F.write(pseudo2HTML(pseudo))

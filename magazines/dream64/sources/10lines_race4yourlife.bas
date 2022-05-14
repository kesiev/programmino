1 hz$="#####":hl$="#########":o=1:v=53248:c=0:pokev+33,0:pokev+32,0:el$="you hit the border - game over":poke v+21,4:poke 2042,13:for n=0to62:readq:poke832+n,q:next:print chr$(147):cl=0:poke v+4,165:poke v+5,50:ix=165
2 for i=1to200:cl=0:gosub6:get a$:if a$="h" then ix=ix-10 :poke v+4,ix
3 if a$="k" then ix=ix+10 :poke v+4,ix
4 if i>3 then cl=peek(53279) :if cl<>0 then print el$:print "type anything + hit return to play again" : input b$ : print chr$(147):goto2:rem end
5 c=c+1:next i:print "end of road - game over":end:data1,255,128,1,0,128,1,126,128,1,0,128,31,129,248,30,129,120,31,0,248,31,0,248,1,0,128,1,0,128,1,0,128,0,129,0,0,129,0,1,0,128,1,126,128,15,126,240,15,60,240,14,129,112,0,66,0,0,60,0,0,24,0

6 if c<=5 then if o=1 then print chr$(30) hz$ hl$ chr$(5) "#" spc(8) "#" chr$(30) hl$:return
7 if c<=5 then if o=2 then  print hz$+left$(hl$,4) chr$(5) "#"spc(8) "#" chr$(30) hl$:return

8 if c>5 and c<=10 then if o=1 then print hz$+left$(hl$,9-(c-5)) chr$(5) "#" spc(9) "#" chr$(30) hl$:if c=10 then c=0: o=2 : return
9 if c>5 and c<=10 then if o=2 then print hz$ "##" left$(hl$,c-2) chr$(5) "#" spc(9) "#" chr$(30) hl$: if c=10 then c=0: o=1:  return
10 return
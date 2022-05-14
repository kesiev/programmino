0 poke53281,0:poke650,128:u=1:v=-1:y=22:m=1024:q=54272:m$="{wht}{home}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}you "
1 r=q+24:x=4+2*int(rnd(1)*16):n=1944+x:poker,0:pokeq+5,97:pokeq+6,200:pokeq+4,17
2 print"{wht}{clr}":c$="{grn}{red}{blu}{wht}":fori=1to70:printmid$(c$,1+int(rnd(1)*4),1)"{rvon}L{CBM-P}{CBM-P}{CBM-P}{rvof}";:next
3 p=m+x+y*40:pokep,32:x=x+u:y=y+v:p=m+x+y*40:t=peek(p):ifx=39orx=0thenu=-u
4 h=t<>61andt<>32andy>0:print"{home}{yel}breakout {gry2}(keys z,x) ";:ify=0ort<>32thenv=-v
5 geta$:pokep,81:p=m+y*40+(xand60):pokeq+1,0:s=s-h:ifs=70thenprintm$"win":end
6 poker,15:ifh=-1thenfori=0to3:pokep+i,32:next:fori=0to10:pokeq+1,255-20*i:next
7 ify=24thenpokeq+1,40:pokeq+5,0:pokeq+4,129:pokeq+4,128:printm$"fail!":end
8 print"{wht}score"s:ifa$="z"ora$="x"thenn=n-2-4*(a$="x"):n=n-2*(n<1944)+2*(n>1982)
9 poker,0:poken-2,32:poken-1,32:poken,61:poken+1,61:poken+2,32:poken+3,32:goto3
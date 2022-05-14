0 fori=0to24:printtab(9)"{white}B"tab(30)"{white}B":next:v=53248:m=v+39:n=m+1:pokem-7,0:pokem-6,0:s=12288
1 poken,1:pokem,1:gosub8:poke2040,192:poke2041,193:pokev,100:pokev+1,84:pokev+2,100:pokev+3,132
2 geta$:u=peek(v):u=u-(a$="k")*8:u=u+(a$="j")*8:pokev,u:pokev+2,u:gosub7
3 c=peek(v+31):o=peek(m):p=peek(n):o=(o-(c=1orc=3))and15:p=(p-(c>1))and15:pokem,o:poken,p
4 ifo=0thenprint"{clr}{white}game over, you win!":print"you killed the combatant!":end
5 ifp=0thenprint"{clr}{white}game over, you lost.":print"you got killed.":end
6 u=u-(112-u)*(u<112):u=u+(u-245)*(u>245):pokev,u:pokev+2,u:goto2
7 pokev+21,3:c=33*-(rnd(0)>0.8):printtab(9);"{white}B";spc(rnd(0)*18);"{red}"chr$(c)tab(30)"{white}B":return
8 fori=0to62:pokes+i,0:pokes+64+i,0:next:data189,189,189,125,189,190,62,102,124,30,36,120
9 fori=0to20:readx:pokes+i,x:poke12414-i,x:next:data30,102,120,30,129,120,28,129,56:return
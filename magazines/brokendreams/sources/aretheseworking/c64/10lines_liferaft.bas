// Modified for Programmino - KesieV
0x=168:y=120:s=4^5:v=s*52:n=v+s:j=s*55:o=1523:f=255:fori=6to51step3:poke832+i,189ori
1f$=f$+"{cm k}":next:t=10:p=o+f:k=8:a=f*k:pokea,13:print"{light blue}{clear}";:poke53281,6:poke53280,6
2i=rnd(.)*k:r=t+m*7:q=x+int(cos(i)*r)*k:r=y+int(sin(i)*r)*k:w=32:l=40:poke886,126
3b=5-b:on128-cgoto7:d=sgn(candk)-sgn(cand4):e=sgn(cand2)-(cand1):x=x+d*k:y=y+e*k:pokep,w
4p=p+e*l+danda+7ors:p=p+(p=a):pokep,46:onhgoto6:poken+g,14:pokeg,w:ifq=xthenifr=ythenh=1:goto6
5ifq>x-168thenifq<x+160thenifr>y-104thenifr<y+96theng=o-(r-y)*5-(q-x)/k:poken+g,t:pokeg,87
6ify>.thenify<fthenpokev+21,-(x>.andx<349):pokev,x+4andf:pokev+16,-(x>f):u=y+2andf:pokev+1,u
7poken+4,22-b:pokeo,86+b:ifpeek(v+31)thenifu>99thenz=f:poken+24,f:poken+1,t:ifhthenm=m+h:h=0:goto2
8c=peek(j):print"{home}{pink}fuel {yellow}"right$(f$,z/17)" "tab(29)"{pink}rescued{yellow}"m:z=z-1:ifzandm<tgoto3
9pokev,0:print"{home}{light blue}{down*12}"tab(15)mid$("game overall saved",1-(m=t)*9,9):waitj,16,16:run
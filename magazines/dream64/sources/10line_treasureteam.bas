0 v=1024:s=v*53:c=s+v:u=56577:pokeu+2,128:poke53281,0:pokes+24,15:print"{clear}"
1 y(2)=c+v:y(3)=c+v+1:y(0)=u:y(1)=u:dimd(15):d(7)=1:d(11)=-1:d(13)=40:d(14)=-40
2 input"2-4";n:forj=1to12:fori=1to20:poke646,6-rnd(1)*n:print"{reverse on}OP{left}{left}{down}L{sh @}{up}";:next
3 print:next:print"{left}{left}{blue}{up}{white}  {left}{left}{down} {ct x}{home}{down}{down}{right}{right}{red} {cyan} {down}{left}{left}{purple} {green} {white}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}":ti$="000000"
4 n=4-n:a(0)=82:a(1)=83:a(2)=122:a(3)=123:pokes+5,68:pokes+6,68:w=32:m=50
5 pokeu,128:forj=nto3:p=d(peek(y(j))and15):pokeu,.:ifp=.then8
6 k=a(j)+p:b=peek(v+k)>w:ifk<.ork>959or(band(peek(c+k)and15)<>j+2)then8
7 pokes+1,m*j+m:pokes+4,33:pokec+k,j+2:pokev+a(j),w:a(j)=k:pokes+4,w+b*-96
8 pokev+a(j),81:next:printti$+"{left}{left}{left}{left}{left}{left}";:ifpeek(v+959)=24then5
9 r$(-(ti$<r$(1)+"{ct x}"))=ti$:print"{right}{right}{right}{right}{right}{right} record:"+r$(1)+" ";:poke198,.:goto2
0 dIc$(51):dId$(26):dIt$(16):x=rN(-ti):fOi=0to16:rEt$(i):nE:fOi=0to51
1 c$(i)=t$(i-int(i/13)*13)+t$(int(i/13)+13):nE:fOi=0to5:rEt(i):nE:dA" 2"," 3"
2 fOi=oto51:r=int(rN(1)*52):t$=c$(i):c$(i)=c$(r):c$(r)=t$:nE:fOi=0to26:dA" 4"
3 d$(i)=c$(i):nE:fOn=1to3:?"♥mindreader: shuffle";:?n;:?"of 3":?:fOi=0to26
4 r=int(rN(1)*9)+int(i/9)*9:t$=d$(i):d$(i)=d$(r):d$(r)=t$:nE:fOi=0to2:dA" 5"
5 ?i+1;:?":";:fOj=0to8::?d$(j+i*9);:?" ";:nE:?:nE:?"card in which row (1-3)?";
6 wA198,1:gEa$:a=aS(a$)-49:on-(a<0ora>2)gO6:?a+1:x=t(a*2):y=t(a*2+1):fOi=0to8
7 t$=c$(i+x):c$(i+x)=c$(i+y):c$(i+y)=t$:nE:fOi=0to8:fOj=0to2:d$(j*9+i)=c$(i*3+j)
8 nE:nE:fOi=0to26:c$(i)=d$(i):nE:nE:?:?"i sense your card is the... ";:?c$(13)
9 dA" 6"," 7"," 8"," 9","10"," j"," q"," k"," a","A","S","X","Z",,9,,18,9,18
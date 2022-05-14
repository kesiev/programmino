0 readl,m,p,t$,u,e$,s$,a$:pokep,0:pokep+1,14:printt$:dimv(19,u):data225,25,53280
1 fory=.tou:forx=.to19:r=x-int(x/3)*3:q=r=0andx>1andx<17and(y=2ory=5ory=8):d$="d
2 a=int(rnd(1)*4)+1:d=3-(r=0ory=0ory=uorr>aandy<>r)+q*a:gosub9:next:next:x=1:y=1
3 getc$:h=(c$="a")-(c$=d$):i=(c$="w")-(c$="s"):a=v(x+h,y+i):data"{clr}{wht}mimizuku saga
4 print"{home}{rvon}{blu}X"m"{left}  S"l"{left}  A"k"{left}  "m$:ifm*l<1thenprinte$mid$(a$,8+7*(l<1),6):end
5 d=5:gosub9:ona+1goto7:onagoto8:on-(a<>2anda<>3orc$="")goto3:data10,"{home}{down}{cyn}{rvon}you "
6 d=3:gosub9:x=x+h:y=y+i:l=l-1:gosub9:on-(a<>2)goto3:print"{clr}":goto1:data"drain:"
7 k=k+7:goto6:data"failed won  {blu}OP{down}{left}{left}[]{pur}::{down}{left}{left}L{SHIFT-@}{brn}{CBM-R}{CBM-R}{down}{left}{left}ii{rvof}  {down}{left}{left}  {wht}(){down}{left}{left})({cyn}YY{down}{left}{left}{SHIFT-POUND}{CBM-*}"
8 m=m-1:q=int(rnd(1)*9):m$=s$+str$(q)+"  ":l=l-(k<q)*(k-q):k=-(k-q)*(k>q):goto6
9 v(x,y)=d:poke211,x*2:poke214,y*2+1:sys58640:print"{rvon}"mid$(a$,d*8+13,8);:return
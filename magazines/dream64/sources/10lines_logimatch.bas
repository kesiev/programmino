0 print"{wht}{clr}{$20}{rvon}{$4c}{$4f}{$47}{$49}{rvof}{$4d}{$41}{$54}{$43}{$48}":poke53280,0:poke53281,0:s=1064:c=55336:dimv(s):dimh(s):v(145)=-1
1 v(17)=1:h(157)=-1:h(29)=1:t=s+9:u=s+2:z=40:w=2:l=0:ti$="235957":p$="{home}{rght}{rght}{rght}{rght}{rght}{rght}{rght}{rght}{rght}{rght}{rght}{red}"
2 x=0:y=0:a=int(rnd(0)*3):b=int(rnd(0)*3):h=int(rnd(0)*1.8)*2-1:v=int(rnd(0)*1.8)*2-1
3 f=5:fori=1tof:forj=1tof:pokes+i*z+j,int(rnd(.)+.5)*80+80:next:next:l=l+1:poke1073,31-(v>0)
4 fori=-1to1:forj=-1to1:pokes+9+(i+2)*z+j,peek(s+w+(w+a+i*h)*z+b+j*v):next:next
5 fori=1tof:forj=1tof:pokec+i*z+j,12+(abs(i-w-y)<wandabs(j-w-x)<w):next:next:poke1155,31+h
6 getd$:printp$;right$(ti$,2)"{wht}"l:on-(mid$(ti$,4,1)="1")goto9:on-(d$="")goto6:on-(d$<>"{$0d}")goto8
7 fori=-1to1:forj=-1to1:on-(peek(t+(i*h+2)*z+j*v)<>peek(u+x+(2+i+y)*40+j))goto6:next:next:goto2
8 x=x+h(asc(d$)):y=y+v(asc(d$)):x=x-int(x/3):y=y-int(y/3):goto5:rem1-liner compo pls!
9 print"{down}{down}{down}{down}{down}{down}{down}{$54}{$49}{$4d}{$45}{$20}{$55}{$50}{$21}{$0d}{$0d}{$59}{$4f}{$55}{$20}{$52}{$45}{$41}{$43}{$48}{$45}{$44}{$20}{$4c}{$45}{$56}{$45}{$4c}";l:input"{$0d}{$54}{$52}{$59}{$20}{$41}{$47}{$41}{$49}{$4e}";x$:ifx$="{$59}"thenrun

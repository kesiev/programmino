0 fori=.to8:readt$:forh=-7to.:t$=t$+right$(t$,1):next:l$(i)=t$:next:poke53280,.:poke53281,.:goto3
1 print"{home}{down}{down}",,int(s)"{left}{$20}{$50}{$54}{$53}{$20}":poke211,x:poke214,y:sys58640:return:data"{gry2}{$65}","{orng}{rvon}{$27}","{pur}{CBM-POUND}","{red}{CBM-I}","{grn}{$2a}"
2 s=s+5*f:x=3+12*z:y=21-h(z):gosub1:printl$(l)"{yel}":y=21:gosub1:printl$(.):return:data"{yel}{$60}","{brn}{$23}","{orng}{rvon}{CBM-T}
3 fori=itol^4:next:h=h+1:poke646,hand6:gosub1:on-(h>7)goto3:print"{blk}{clr}","{swuc}{dish}{wht}{$42}{$4f}{$48}{$20}{gry3}10{$4c}{$20}{$50}{$55}{$52}{$2d}80{$20}2019"
4 m=1:n=2^h:f=2:p=.:z=.:fori=.toh:h(.)=i:l=(i-7)*(i<h)+1:b(.,i)=l:b(i,.)=8:gosub2:next
5 print"{home}{down}{down}","{gry1}{$52}{$45}{$41}{$44}{$59}{$3f}{pur}":y=8:gosub1:print"{$20}{$20}{$20}{lred}{$41}{$4e}{$4e}"t$"{grn}{$4d}{$45}{$4c}"t$"{lblu}{$5a}{$41}{$4b}":h(2)=.:getk$:ifk$=""goto5
6 print"{home}{down}{down}","{red}{$47}{$4f}{$21}{$2e}{$2e}{$2e}{pur}":y=9:poke781,y:fori=.to1:s=s+(2+(m<n))*(s>.5)*.1:x=6+12*p:sys59903
7 gosub1:print"{$60}{$60}{$60}":getk$:p=p-(k$="{left}")*(p>.)+(k$="{rght}")*(p<2):ifk$<>chr$(13)theni=i-1:next:data"{$20}"
8 p(i)=p:printmid$("{lred}{grn}{lblu}",p+1,1):next:v=p(.):z=p:l=b(v,h(v)):on-(l>=b(z,h(z)))goto6:f=-(m<n)
9 m=m+1:h(z)=h(z)+1:b(z,h(z))=l:gosub2:l=8:z=v:gosub2:h(v)=h(v)-1:on-(h(2)<h)goto6:goto3
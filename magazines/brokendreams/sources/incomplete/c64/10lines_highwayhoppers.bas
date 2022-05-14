0print"{purple}{clear}{green}";:s=1024:c=55296:f=5:poke53280,5:poke53281,0:a$(0)="{reverse on} {reverse off}":fori=1to8:a$(i)=" "
1print"{reverse on}  {reverse off} {reverse on}  ";:next:k=198:h=81:fori=0to39:pokes+400+i,102:pokes+800+i,102:next:g$="{up}{148}{left}{left} "
2l=23:b=0:w=32:o=900:pokes+o,h:pokec+o,5:poke214,21:sys58640:print:print" {yellow}score"rtab(36)"{green}Q"f
3print"{home}":fori=1to2:print" {delete}{brown}"tab(39)a$(pand8):printtab(40)"{delete}":iff=0thenprinttab(16)o$:pokek,0:waitk,1:geta$:run
4printg$"{orange}"a$(pand4):print:next:print:print:o=o+abs(l=9orl=5):o=o+(l=7orl=3):ifl>11andl<21thenpokes+o,32
5fori=1to2:print" {delete}"tab(39)chr$(149+rnd(0)*8)a$(rnd(0)*8):printtab(40)"{delete}":printg$a$(rnd(0)*8):print:next
6z=peek(s+o):b=z=160orl>1andl<10andz=32:geta$:ifl>10andl<20thenpokes+o,h:pokec+o,5
7p=(p+1)and15:on-(a$=""andb=0)goto3:pokes+o,q:pokec+o,w:l=l-2:o=o-80:q=peek(s+o):w=peek(c+o)
8ifl=1andq<>32orl>1andl<10andq=32orb<0thenf=f-1:pokes+o,86:pokec+o,2:print"{down}{down}"tab(36)"{green}Q"f;:goto2
9pokes+o,h:pokec+o,5:r=r+10:printtab(6)"{down}{down}{yellow}"r:o$="{down}{down}{down}{down}{down}{red}game over":on-(l<>1)goto3:r=r+40:goto2
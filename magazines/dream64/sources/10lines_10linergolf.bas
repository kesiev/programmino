10 fori=0to62:poke832+i,0:next:v=53248:poke2040,13:pokev+21,1:poke851,8:poke854,28:poke857,8
11 forf=0to2:readf$(f):next:data"{grn}{$20}{$20}","{blu}{CBM-U}{CBM-U}","{yel}{CBM-+}{CBM-+}":print"{clr}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{down}{rvon}"f$(0)f$(0);
12 fori=0to19:printf$(int(rnd(1)*3));:next:print"{up}"spc(12+rnd(1)*20)"{grn}{$20}{rvof}{wht}{$6c}{SHIFT-@}{grn}{rvon}{$20}{down}":poke53281,14:x=40:y=194
31 gosub63:input"{up}{rvof}{blu}{$50}{$4f}{$57}{$45}{$52}{$3a}{rght}{$20}{$20}{$20}{$20}{left}{left}{left}{left}{left}";p:yp=-p:sx=x:sy=y
32 gosub63:ifx>=336thenx=sx:y=sy:goto31
50 x=x+p:y=y+yp:p=p*.93:yp=yp+2:ify>194theny=194:yp=-yp*0.01
51 gosub63:on(y=194and(p<=.02oryp>-0.1))*-1goto60:goto32
60 c=(peek(56056+(x-10)/8)and15):ifc=1thenprint"{$57}{$49}{$4e}{$4e}{$45}{$52}":fori=0to206:poke53280,i:next:c=6
62 on(c<>6)*-1goto31:restore:goto11
63 pokev,xand255:pokev+16,-(x>=256):pokev+1,-(y>=0)*y:return
10 rem *******************************
20 rem *** single-deck blackjack   ***
30 rem *** (c) 2019 by @romwer     ***
40 rem *** roman.werner@gmail.com  ***
50 rem *** 'd' = double down       ***
60 rem *** 'h' = hit               ***
70 rem *** 's' = stand             ***
80 rem *** 'c' = show hi/lo count  ***
90 rem *******************************
100 print"{black}{clear}"tab(14)"please wait":v=53248:s=54272
110 pokev+21,0:pokev+32,5:pokev+33,5:pokev+34,2:pokev+35,1:pokev+36,0
120 fori=stos+24:pokei,0:next:pokes,31:pokes+1,31:gosub1850
130 pokev+24,peek(v+24)and240or14:pokev+17,peek(v+17)or64:gosub2070
140 hi=51:dimcd(hi):nc=13
150 bl=200:bt=0
160 ln$="{home}{down*24}":sp$="())))))))))))))))))*"
170 hs$="{white} hit or stand? ":fc$=" jqka":wn$="WINS{sh space}"
180 bu$="{white}{reverse on}{sh space}BUST{sh space}{reverse off}"
190 bj$(1)="BJ{sh space}":r$="{down}{left*6}":v$="{white}=":w$="{white}>"+r$
200 q$="{white}={reverse on}{space*4}{reverse off}>"+r$:o$="{white}())))*"+r$
210 u$="{white}:;;;;<{light green}"
220 n$="={reverse on}{light blue}''''{reverse off}{white}>"+r$:z$="{down*2}{yellow}{space*4}$0"
230 pt$=o$+n$+n$+n$+n$+n$+n$+u$:pd$(0)=left$(ln$,14)+"{white}player "
240 pd$(1)="{home}{down*2}{white}dealer ":up$="{up*9}"
250 fori=.tohi:cd(i)=i:next:gosub1260
260 a=fre(0):a=rnd(-ti):z=0:hl=0:print"{home}{black}"tab(15)"shuffling"
270 pokes+24,15:pokes+4,129:fori=1to15:next:pokes+4,0
280 fori=hito1step-1:a=rnd(1)*(i+1):b=cd(i):cd(i)=cd(a):cd(a)=b
290 ifi<30thenpokes+4,129:pokes+4,0
300 next:pokes+24,7:fori=1to500:next
310 rem ******************
320 rem *** next round ***
330 rem ******************
340 pokev+21,0:print"{clear}"tab(15)"{black}blackjack":a$=")":a=1:gosub1810
350 printpd$(1)tab(31)"your bet"pd$(0)tab(32)"balance":gosub1570
360 f=0:g=0:x=0:y=0:sd=0:is=0:dt=6:pt=6:h=0:o=1:d=0:hd=0:gosub810
370 ifd(0)=11andbl>=(bt/2)thenis=1:printtab(13)"{light green}insurance y/n?"
380 gosub920:fori=0to125:next:pokes+4,129:pokes+4,0
390 print"{home}{down*3}"tab(dt)pt$:hd=1:gosub840:hd=0
400 gosub920:ifis=1thengosub1160
410 a$="":a=0:ifbl>=btthena$=a$+" {light green}double,":a=8
420 a$=a$+hs$:a=a+15:gosub1810
430 rem *****************
440 rem *** main loop ***
450 rem *****************
460 ifpeek(197)= 20thenprintleft$(ln$,3)tab(16)"{light green}count"hl
470 ifpeek(197)<>20thenprintleft$(ln$,3)tab(16)"{space*8}"
480 ifx>21ory>16orx=21and(y>16org=2)goto590
490 getk$:ifk$="h"andsd=0thengosub920:ifx<21thena$=hs$:a=15:gosub1810
500 ifnot(k$="d"andg=2andbl-bt>=0)thengoto520
510 d=1:bl=bl-bt:bt=bt*2:printpd$(1)tab(28)"2x":gosub1570:gosub920:goto530
520 ifk$<>"s"andsd=0andx<>21thengoto460
530 sd=1:iff>1thengosub810
540 iff=1thencd=e(1):printpd$(1):gosub850
550 goto460
560 rem ***********************
570 rem *** show the winner ***
580 rem ***********************
590 iff=1thencd=e(1):printpd$(1):gosub850
600 p=abs(x<>21andy<22andy>xorx>21):ifnot(is=1andy=21)thengoto630
610 print"{down*3}"tab(14)"ins. pays {yellow}$";mid$(str$(bt),2)
620 wn=bt+bt/2:bl=bl+wn:gosub1580:gosub1630
630 ifx=21andg=2thenh=1:printpd$(0)"{white}{sh space}"bj$(h):o=1.5:iff>2thenp=0:goto660
640 ify=21andf=2thenh=1:printpd$(1)"{white}{sh space}"bj$(h):ifg>2thenp=1:goto660
650 ify=xthenprintleft$(ln$,13)tab(17)"{white}{reverse on}{sh space}TIE{sh space}":bl=bl+bt:goto710
660 printpd$(p)"{white}{sh space}"bj$(h)wn$;
670 ifp=1andx<=21thenprinttab(33)z$:gosub1700
680 ifp<1thenwn=bt+bt*o:bl=bl+wn
690 ifp=0thenprint" {yellow}$"+mid$(str$(wn),2);:gosub1630:printtab(28)"{white}new"
700 gosub1580:ifbl=0thengosub1750:poke198,0:wait198,1:goto150
710 ifbl>0thena$=" {white}press space {light green}/ f1 change bet ":a=29:gosub1810
720 bt=0:getk$:ifk$=""thengoto740
730 ifk$="{f1}"thengosub1260:goto760
740 ifk$<>" "thengoto720
750 bt=lt:bl=bl-bt:ifbl<0thenbt=bl+bt:bl=0
760 poke198,0:gosub1570:pokes+24,7:ifz<39thengoto340
770 goto260
780 rem ************************
790 rem *** dealer gets card ***
800 rem ************************
810 printpd$(1):iff<>5thengoto840
820 gosub1530:dt=3:fori=0to4:cd=e(i):t=i*dt:gosub1060:printup$:next
830 fori=1to500:next
840 cd=cd(z):z=z+1
850 t=f*dt:gosub1060:d(f)=r:e(f)=cd:ifhd=1thenreturn
860 y=0:fori=0tof:y=y+d(i):next:fori=0tof:ify>21andd(i)=11theny=y-10
870 next:f=f+1:printy:ify>21thenprintpd$(1)bu$
880 return
890 rem ************************
900 rem *** player gets card ***
910 rem ************************
920 printpd$(0):ifg<>5thengoto950
930 gosub1530:pt=3:fori=0to4:cd=q(i):t=i*pt:gosub1060:printup$:next
940 fori=1to500:next
950 cd=cd(z):z=z+1:t=g*pt
960 ifg>1thenpokes+4,129:pokes+4,0:printtab(t)pt$"{up*8}":fori=1to500:next
970 gosub1060:p(g)=r:q(g)=cd:x=0:fori=0tog:x=x+p(i):next
980 fori=0tog:ifx>21andp(i)=11thenx=x-10
990 next:ifg>0thenprintx
1000 ifx>21thenprintpd$(0)bu$pd$(1)tab(33)z$:a$=")":a=1:gosub1810:gosub1700
1010 g=g+1
1020 return
1030 rem **************************
1040 rem *** give and show card ***
1050 rem **************************
1060 a=int(cd/nc):r=cd-a*nc:p=(r-8)andr>8:r=r+2:hl=hl+(r>9)+abs(r<7):f$=str$(r)
1070 ifp>0thenf$=mid$(fc$,p,2):r=10-(p=4)
1080 ifhd=1thenreturn
1090 d$=mid$("!#%&",a+1,1):f$=mid$(f$,2,len(f$)-1):p$=left$("{space*2}",3-len(f$))
1100 c$=mid$("{red}{black}",(a/2)+1,1):pokes+4,129
1110 printtab(t)o$v$c$"{reverse on}"d$p$f$"{reverse off}"w$q$q$q$q$v$c$"{reverse on}"f$p$d$"{reverse off}"w$u$
1120 pokes+4,0:return
1130 rem *****************
1140 rem *** insurance ***
1150 rem *****************
1160 getk$:ifk$<>"y"andk$<>"n"thengoto1160
1170 printleft$(ln$,13)tab(13)"{space*14}":ifk$<>"y"thenis=0:return
1180 bl=bl-bt/2:gosub1580:printpd$(1)
1190 printtab(6)"{space*6}"r$o$"={reverse on}{blue}''''{reverse off}{white}>";
1200 pokes+4,129:pokes+4,0:fori=1to500:next:pokes+4,129:pokes+4,0
1210 printpd$(1):printtab(6)pt$:ifd(1)<>10thenis=0:return
1220 y=21:return
1230 rem *********************
1240 rem *** betting money ***
1250 rem *********************
1260 print"{clear}"tab(15)"{black}blackjack":fori=0to3:b(i)=0:next:pokev+21,15
1270 pokes+24,15:printpd$(1)tab(31)"{white}your bet"pd$(0)tab(32)"{white}balance"
1280 printleft$(ln$,14)tab(14)"{white}({blue}* {white}({red}* {white}({purple}* {white}({black}*"
1290 printtab(14)"{blue}:{white}< {red}:{white}< {purple}:{white}< {black}:{white}<"
1300 print:printtab(14)"f1 f3 f5 f7":print:printtab(13)"{yellow}$1{space*2}5{space*2}25 100{white}"
1310 print"{down*3}"tab(9)"place your bet please":print
1320 a$="{white} press space to deal ":a=21:gosub1810
1330 gosub1570
1340 getk$:ifk$=""thengoto1340
1350 ifk$=" "andbt>0thenlt=bt:return
1360 k=asc(k$)-133:b=kand3:ifk<0ork>7goto1340:rem only accept keys f1-f8
1370 c$=mid$("{blue}{red}{purple}{black}",b+1,1)
1380 cp$="{space*2}{down}{left*2}{white}("+c$+"*{down}{left*2}:{white}<{down}{left*2}{space*2}"
1390 v(0)=1:v(1)=5:v(2)=25:v(3)=100:a=v(b):i=1:ifk>3theni=-1
1400 a=a*i:ifi=-1andb(b)=0ori=1andb(b)=5orbl-a<0thengoto1340
1410 b(b)=b(b)+i:bl=bl-a:bt=bt+a:pokes+1,40:pokes+4,17
1420 fori=0to10:next:pokes+4,0:pokes+1,31:onk/4+1gosub1460,1480
1430 ifb(b)=0thenprint"{home}{down*2}"tab(14+b*3)"{space*2}{down}{left*2}{space*2}"
1440 ifb(b)=5thenprint"{home}{down*13}"tab(14+b*3)"{space*2}{down}{left*2}{space*2}"
1450 goto1330
1460 printleft$(ln$,10):fori=0to(10-b(b)*2)
1470 printtab(14+b*3)right$(cp$,15)"{up*4}":next:return
1480 printleft$(ln$,2+b(b)*2):fori=0to(10-b(b)*2)
1490 printtab(14+b*3)left$(cp$,15)"{up*2}":next:return
1500 rem ************************************
1510 rem *** clear cards when more than 5 ***
1520 rem ************************************
1530 fori=0to4:forw=1to8:printtab(i*6)"{space*6}":next:printup$:next:return
1540 rem ****************************************
1550 rem *** convert bet and balance to string **
1560 rem ****************************************
1570 bt$=mid$(str$(bt),2):printleft$(ln$,5)tab(36-len(bt$))"{space*2}{yellow}$"bt$
1580 bl$=mid$(str$(bl),2):printleft$(ln$,16)tab(36-len(bl$))"{space*2}{yellow}$"bl$
1590 return
1600 rem **************************
1610 rem *** play winning sound ***
1620 rem **************************
1630 j=5+int(15/500*(wn-(wn/200)))+1:ifj>15thenj=15
1640 fori=7to0step-1:pokes+24,i:next:pokes+6,255:pokes+4,129
1650 fori=0tojstep.25:pokes+24,i:next:fori=jto0step-0.1:pokes+24,i:next
1660 pokes+4,0:pokes+6,0:return
1670 rem *************************
1680 rem *** play losing sound ***
1690 rem *************************
1700 pokes+5,127:pokes+6,240:pokes+4,17:fori=19to6step-1:pokes+1,i
1710 forj=0to20:next:next:fori=4to0step-1:pokes+2+i,0:next:pokes+1,31:return
1720 rem **********************
1730 rem *** show game over ***
1740 rem **********************
1750 printleft$(ln$,23);tab(13)"{black}()))))))))))*"
1760 printtab(13)"={reverse on}{sh space}{white}GAME{sh space}OVER{sh space}{reverse off}{black}>"
1770 a$="*{black}:;;;;;;;;;;;<{brown}(":a=15:gosub1810:return
1780 rem **************************************
1790 rem *** print bottom line with actions ***
1800 rem **************************************
1810 b=(39-a)/2:println$"{brown}"left$(sp$,b)a$"{brown}"right$(sp$,b)"{up}":return
1820 rem ****************************
1830 rem *** copy char rom to ram ***
1840 rem ****************************
1850 poke56334,peek(56334)and254:poke1,peek(1)and251:poke781,2:poke782,255
1860 poke90,0:poke91,209:poke88,0:poke89,57:sys41960:poke1,peek(1)or4
1870 poke56334,peek(56334)or1:fora=14600to14679:readze:pokea,ze:nexta
1880 fora=14800to14839:readze:pokea,ze:nexta:return
1890 data 54,127,127,127,62,28,8,0:rem heart !
1900 data 102,102,0,0,0,0,0,0:rem double quotes "
1910 data 8,28,62,127,62,28,8,0:rem diamond #
1920 data 16,126,208,124,22,252,16,0:rem dollar sign $
1930 data 8,28,42,127,42,8,28,0:rem club %
1940 data 8,28,62,127,127,54,8,0:rem spade &
1950 data 102,189,219,102,102,219,189,102:rem pattern '
1960 data 0,0,0,0,7,15,15,15:rem top left corner (
1970 data 0,0,0,0,255,255,255,255:rem top border )
1980 data 0,0,0,0,224,240,240,240:rem top right corner *
1990 data 15,15,15,7,0,0,0,0:rem bottom left corner :
2000 data 255,255,255,255,0,0,0,0:rem bottom border ;
2010 data 240,240,240,224,0,0,0,0:rem bottom right corner <
2020 data 15,15,15,15,15,15,15,15:rem left border =
2030 data 240,240,240,240,240,240,240,240:rem right border >
2040 rem ***********************************************
2050 rem *** initialize 4 sprites for blackjack logo ***
2060 rem ***********************************************
2070 pokev+23,0:pokev+78,0:pokev,157:pokev+1,85:pokev+2,181
2080 pokev+3,85:pokev+4,157:pokev+5,106:pokev+6,181:pokev+7,106
2090 fori=.to3:pokev+39+i,13:next:pokev+27,255
2100 poke2040,232:poke2041,233:poke2042,234:poke2043,235
2110 fori=.to255:reada:poke14848+i,a:next:return
2120 rem *** sprite 0: bj logo top left ***
2130 data 0,0,6,0,0,15,0,0,15,0,7,206,7,255,204,15
2140 data 255,220,15,31,219,15,191,159,15,191,159,15,191,191,6,63
2150 data 191,7,255,63,7,255,63,7,255,127,7,255,127,7,254,127
2160 data 7,254,127,7,254,252,3,254,248,3,252,248,3,252,240,0
2170 rem *** sprite 1 bj logo top right ***
2180 data 0,0,0,224,0,0,254,0,0,127,224,0,127,254,0,127
2190 data 255,224,127,255,240,127,255,240,255,255,224,255,255,224,255,255
2200 data 224,255,255,192,255,255,192,255,255,192,243,255,192,225,255,192
2210 data 1,255,128,0,255,128,0,127,128,0,63,0,0,31,0,0
2220 rem *** sprite 2 bj logo bottom left ***
2230 data 3,253,240,3,253,248,3,249,248,3,249,252,3,251,255,3
2240 data 251,255,1,243,252,1,243,255,1,247,255,1,247,255,1,231
2250 data 255,1,231,255,1,239,255,1,239,255,0,239,255,0,231,255
2260 data 0,240,127,0,255,7,0,255,240,0,127,0,0,0,0,0
2270 rem *** sprite 3 bj logo bottom right ***
2280 data 0,31,0,0,31,0,0,30,0,0,30,0,208,62,0,12
2290 data 254,0,7,254,0,227,252,0,255,252,0,255,252,0,255,252
2300 data 0,255,248,0,254,248,0,254,152,0,254,56,0,254,48,0
2310 data 254,112,0,255,240,0,127,240,0,3,224,0,0,96,0,0
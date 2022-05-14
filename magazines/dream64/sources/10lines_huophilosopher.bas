   10 dimz$(17):dimw$(18):diml$(10):b=1:printchr$(147):print"huo philosopher v2.0 by s.kakos (2021)":print:input"activate neural learning? (y/n)";n$:print:print"come, say something":inputa$:x$(1)="interesting, but...":x$(2)="you never know. you see..."
   20 x$(3)="why?":x$(6)="so?":x$(4)="think without thinking":x$(5)="analysis destroys thought":y$(1)="god":y$(2)="being":y$(3)="existence":y$(4)="life":y$(5)="self":y$(6)="death":y$(7)="reality":y$(8)="change":y$(9)="the universe":y$(10)="knowledge"
   30 z$(1)=" defines ":z$(2)=" creates ":z$(3)=" sustains ":z$(4)=" transcends ":z$(5)=" destroys ":z$(6)=" allows ":z$(7)=" manifests through ":z$(8)=" obscures ":z$(9)=" affects ":z$(10)=" contains ":z$(12)=" supports ":z$(13)=" stems from "
   40 z$(11)=" is ":z$(14)=" produces ":z$(15)=" leads to ":z$(16)=" breeds ":z$(17)=" needs ":w$(1)="existence":w$(2)="god":w$(3)="life":w$(4)="the self":w$(5)="being":w$(6)="others":w$(7)="death":w$(8)="reality":w$(9)="the cosmos":w$(10)="change"
   50 w$(11)="perception":w$(12)="nothingness":w$(13)="truth":w$(14)="one":w$(15)="faith":w$(16)="humans":w$(17)="memory":w$(18)="faith":e$(1)="logic is irrational":e$(2)="stop thinking...":e$(3)="feel the abyss...":e$(4)="being is me..."
   60 e$(5)="close your eyes to see":e$(6)="do you see?":e$(7)="i only know what i know":e$(8)="all is one":x=rnd(-ti):x=int(6*rnd(1))+1:y=int(10*rnd(1))+1:z=int(17*rnd(1))+1:w=int(18*rnd(1))+1:e=int(8*rnd(1))+1
   65 fori=1tob:ifl$(i)=str$(x)+str$(y)+str$(z)+str$(w)+str$(e)thengoto60:nexti
   70 print:printx$(x):fori=1to2000:nexti:printy$(y)+z$(z)+w$(w):fori=1to2000:nexti:printe$(e):print:ifn$="y"theninput"was that answer satisfactory (y/n)";v$:ifv$="n"thenl$(b)=str$(x)+str$(y)+str$(z)+str$(w)+str$(e):print"combination to cancel:"+l$(b):b=b+1
   80 ifb>10thenb=10
   90 print:input"tell me more (q to exit)";a$:ifa$<>"q"thengoto60

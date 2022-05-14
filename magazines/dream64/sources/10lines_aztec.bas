0readl$:s$="{reverse off}{green} U{down}{left}{left}U{light green}K":t$(0)="{reverse on}{black}  {down}{left}{left}  ":t$(1)="{reverse on}{pink}{sh @}{yellow}{cm p}{down}{left}{left}{cm p}{pink}{sh @}":t$(2)="{white}{reverse on}{sh pound}{purple}{cm asterisk}{down}{left}{left}{reverse off}{cm asterisk}{dark gray}{sh pound}"
1f=53280:pokef,0:pokef+1,0:print"{clear}";:p=211:r=214:m=20:fori=1tolen(l$):c=asc(mid$(l$,i,1))-35
2t=int(c/m):n=c-t*m:forj=1ton:printt$(t)left$("{up}",pos(0));:d=d-(t=2):next:next:q=58640:x=18
3m$="{reverse on}{orange}{cm v}{brown}{cm c}{down}{left}{left}{pink}L{red}{sh @}{left}{left}{up}":print"{reverse off}{white}temple"tab(32)"diamons{left}{148}d";:y=x:s=160:v=0:l=l+1:poke198,0
4o=1024+y*40+x:e=e-(peek(o)=233):pokep,16:ifpeek(o)=32thenpokef,2:fori=0to99:next:pokef,0:v=v+1
5poker,24:sysq:print"{reverse off}{white}"l":"etab(26)"{red}";:ifv=3thenprint"{right}{right}{red}Q{home}"tab(14)"{white}{reverse off} game over ":wait197,8:run
6printleft$("QQ",v);:pokep,x:poker,y:sysq:printm$;:ife=dthenprint"{reverse on}{light blue}OP{down}{left}{left}  ":fori=0tor:pokef,iand7:next:goto1
7geta$:a=(a$="{left}")-(a$="{right}"):b=(a$="{up}")-(a$="{down}"):z=a*2+b*80:ifz=0orpeek(o+z)=250goto7
8printt$(0):x=x+a*2:y=y+b*2:on-(rnd(0)>l/morpeek(o+z*3)<>s)goto4:pokep,x+a*4:poker,y+b*4:sysq
9prints$:goto4:dataj959%8m8%m%8m8%9l$8m8%9%8m8$l9l$;%9%;$l9l3l9&;o;&9&8u8&9&c&959q$;$qj9
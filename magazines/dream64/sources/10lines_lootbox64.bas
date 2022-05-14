0poke53280,0:poke53281,0:s=4:fori=0to7:readf$(i):x=(y+(rnd(0)*3)+1)and3:y=x:a(i)=x*2:next
1w$="{light blue}{down}{down} win:":print"{clear}{yellow}  $"s"{down}":print" ";:fori=1to3:print"{white}U{light blue}{sh asterisk*2}{blue}I";:next:print:print"{down}{down}{down}{light blue}{reverse on}{cm asterisk}{down}{left}{reverse off}{blue}{sh pound}{home}{down}{down}"
2poke198,0:r$="{down}{left}{left}":fori=1to11:printtab(1)"B  BB  BB  B":next:print" ";:fori=1to3:print"{blue}J{light blue}{sh asterisk*2}{white}K";:next
3print"{up}{up}{dark gray}{reverse on} {reverse off}{up}{left}{sh @}{cm h}{up}{left}{left}";:fori=1to4:print"{gray}{cm n}{dark gray}{cm h}{up}{left}{left}";:next:print"{red}JK{up}{left}{left}{pink}U{red}I":print"{home}"tab(8)"{light green}l{green}QQ{light green}t"
4j=(j+1)and7:k=j:fori=0to2:a=a(k):a$=a$+f$(a)+r$+f$(a+1)+r$+"  "+r$:k=(k+1)and7:next
5forl=0to2:print"{home}{down}{down}{down}"tab(t*4+2)left$("{down}{down}",2-l)a$:next:a$="":on-(peek(198)=0)goto4
6t(t)=a((j+1)and7)/2+1:t=t+1:printtab(t*4-2)"{pink}{reverse on}  ":poke198,0:on-(t<3)goto4:v$=chr$(13)+"{down}  "
7ift(0)=t(1)andt(1)=t(2)thent=t(1)*2:printw$;:fori=1tot:forj=1to600:next:print"{yellow}Q";:next:s=s+t
8poke198,0:wait198,1:poke198,0:s=s-1:t=0:on-(s>=0)goto1:print"{red}{home}you are broke!":wait198,1:run
9data"{green}U{green}{cm w}","{red}Q{red}Q","{light blue}{reverse on}{cm +}{reverse off}{cm +}","{light blue}{reverse off}{cm +}{reverse on}{cm +}{reverse off}","{yellow}{reverse on}{sh pound}{brown}{reverse off}{cm v}","{yellow}{reverse off}{cm asterisk}{reverse on}{cm asterisk}{reverse off}","{purple}{cm t}{sh pound}","{purple}N "
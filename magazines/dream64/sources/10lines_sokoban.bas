0 readn,m,q,a,b:fori=1ton:forj=1tom:readm(i,j):next:readt$(i-1):next:poke53281,0
1 t$(2)=t$(3):t$(6)=t$(5):print"{clr}{down}":fory=1ton:forx=1tom:gosub8:p=p-(m(y,x)=3)
2 next:print"{down}":next:x=a:y=b:data9,8,7,3,3,,,4,4,4,4,4,,"  {down}{left}{left}  ",4,4,4,,,,4,
3 geta$:f=(a$="a")-(a$="d"):g=(a$="w")-(a$="s"):ifp=qthenprint"{home}{wht}you win!":end
4 print"{home}{wht}"p"/"q,t:u=x+f:v=y+g:z=u+f:w=v+g:ifm(v,u)=4orm(v,u)>1andm(w,z)>1goto3
5 m(y,x)=m(y,x)-5:gosub8:y=w:x=z:ifm(v,u)<2goto7:data"{lred}{CBM-A}{CBM-S}{down}{left}{left}{CBM-Z}{CBM-X}",4,1,5,2,,,4,,
6 m(w,z)=2+m(w,z):p=p+(m(v,u)=3)-(m(w,z)=3):m(v,u)=m(v,u)-2:gosub8:data4,4,4,,2
7 t=t+1:x=u:y=v:m(y,x)=5+m(y,x):gosub8:goto3:data1,4,,"{wht}{rvon}{SHIFT-POUND}{pur}{CBM-*}{down}{left}{left}{rvof}{CBM-*}{gry1}{SHIFT-POUND}",4,1,4,4,2,
8 poke211,2*x:poke214,2*y:sys58640:printt$(m(y,x)):return:data4,,"{rvon}{gry1}{SHIFT-@}{gry2}{CBM-P}{down}{left}{left}{CBM-P}{gry1}{SHIFT-@}{rvof}"
9 data4,,4,,1,,4,4,"{rvon}{orng}{CBM-V}{brn}{CBM-C}{down}{left}{left}{lred}L{red}{SHIFT-@}{rvof}",4,2,,3,2,2,1,4,,4,,,,1,,,4,,4,4,4,4,4,4,4,4,,
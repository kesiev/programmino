0 l$="":forh=1to40:l$=l$+" ":next:b$="{CBM-I}{CBM-I}{CBM-I}{CBM-I}    {CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}       {CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}  {CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}{CBM-I}"
1 print"{clr}":fori=0to24:poke55315+40*i,5:next:x=12:y=0:deffnd(e)=1043+40*e:m=0
2 gosub9:ifm>0thenpokefnd(y),32:y=y+1:s=peek(fnd(y)):gosub9
3 if(y=x)thenpoke55315+40*y,5:if(s<>32)thengosub7:x=x-1:y=0:m=0:gosub9
4 ifx<1thenprint"{clr}sorry, you lose.":end
5 ify>=24thengosub7:x=x+1:y=0:gosub9:m=0:ifx>=24thenprintw$:end
6 b$=right$(b$,39)+left$(b$,1):gosub8:geta$:w$="{clr}yay, you win!":goto2
7 t$=b$:b$=l$:gosub8:b$=t$:pokefnd(y),32:poke55315+40*x,5:return
8 poke211,0:poke214,x:sys58732:print"{red}"+b$;:poke53280,0:poke53281,1:return
9 m=-int(a$<>"")orm:a$="":pokefnd(y),87:return
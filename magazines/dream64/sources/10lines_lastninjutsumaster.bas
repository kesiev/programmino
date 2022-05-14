0v=53248:j=56320:pokev+32,0:pokev+33,0:fori=0to23step3:poke871+i,255:next:d$="{down}{down}{down}":e=1:a=1
1s=2040:pokes,13:pokes+1,13:d=-4:l=15:m=25:x=255:k=88:l$="{cm q}{cm w}{down}{left}{left}":pokev+39,2:pokev+40,11
2y=220:print"{clear}";:fori=6to1step-1:printd$:forf=1tol:print"{light green}{cm y}{green}E";:next:print"{light green}{cm y}{light blue}"i"{left}f";:next:fori=0to5
3c=m-c:poke211,c+2:poke214,i*4:sys58640:print"{brown}"l$l$l$l$;:next:pokev+2,x:pokev+1,y:pokev+3,y
4pokev+21,3:ifz=0thenk=k+e:e=e*((k<31ork>255)or1):on-(k<31ork>255)goto4:pokev,k
5a$="{home}{purple}game over!":b$="{yellow}my hero {red}S":w=peek(v+30):ifpeek(j)=111andh=0thenpokev+3,y-9:h=8
6b=282:ifw>0ora$=b$thenprint"{home}"a$:poke877,147:poke198,0:wait198,1:pokev+2,0:pokev,15:pokev+30,0:run
7ifh>0thenh=h-1:ifh=0thenpokev+3,y:ifabs(k-x)<8thenpokev,0:z=1:e=e+sgn(e):ifa=6thena$=b$:goto6
8ifzand(xand15)=7andh=0andpeek(v+31)=2theny=y-32:pokev+3,y:k=b-x:pokev,k:pokev+1,y:z=0:a=a+1
9x=x+d:d=d*((x=31orx=255)or1):pokev+2,x:pokev+30,0:pokev+31,0:on-(z=1)goto8:goto4
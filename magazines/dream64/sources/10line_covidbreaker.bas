0 deffnr(x)=int(rnd(1)*x):py=rnd(-ti):dimx,y,p,hx(3),hy(3),hd(3),mx(3),my(3),md(3),mr(3):py=214:v=53248:v2=v+2:v9=v+16:vc=v+30:jo=56320:jl=4:jr=8:jv=3:jd=2:yj=32:p0=2040:pm=2041:sb=248:sm=250:d8=.125:f=255:b(0)=2:b(1)=4:b(2)=8:b(3)=16:si=54296:ax=23:bx=328
1 ml=342:ei=80:do=46:li=3:bs=8:lv=1:hr$(0)="{reverse on}{blue}{cm y*2}":hl$(1)="{reverse on}{blue}{cm y*2}{reverse off}":pokev+32,0:pokev+33,0:fori=0to255:reada:poke15872+i,a:next:pokep0,sb:pokev+37,9:pokev+38,1:pokev+39,2:pokev+40,3:pokev+45,2:pokev,x:pokev+1,y:pokev+28,63:gosub7:data,,,,,,2,170,160,10,170,168,42,170,170,37,85,86,21,247,213,60
2 i=i+1and3:j=notpeek(jo):vx=(jandjr)-(jandjl)*2:l=x+vx>=axandx+vx<=bx:x=x-vx*l:pokev,xandf:pokev9,peek(v9)and254or-(x>f):p=p-sgn(vx)*l:ifjandjvthenifpeek(p-ei+ei*(jandjd))=32thenvy=-yj+(jandjd)*yj:y=y+vy:pokev+1,y:p=p+sgn(vy)*160:data243,207,60,,15,,,,,,,,,,,,,60,243,207,29,247,221
3 ifpeek(p)=dothenpokep,yj:pokesi,15:pokesi,0:sc=sc+10:de=de+1:print"{home}{reverse off}{green}"tab(7)sc:ifde=65thende=0:lv=lv+1:bs=bs+2:gosub7:goto2:data37,85,86,42,170,170,10,170,168,2,170,160,,,,,,,,,,,,,,,,,,,,2,170,160,10,170,168,42,170,170,37,85,86,21,247,213,60,243,207,60,,15,60,243,207,21,247
4 pokepm+i,sm+(rand1):pokep0,sb+(r*2and1):pokepy,hy(i):print:hd=-(hd(i)>.):printtab(hx(i))hl$(hd)"    "hr$(hd);:hx(i)=hx(i)+hd(i):ifhx(i)>33orhx(i)<.thenhd(i)=-hd(i):hx(i)=hx(i)+hd(i):DATA213,37,85,86,42,170,170,10,170,168,2,170,160,,,,,,,,,,,,,,,,,,,,,128,128,8,34,8,2,34,32,32
5 mx(i)=mx(i)+md(i):pokev2+i*2,mx(i)andf:pokev9,peek(v9)andf-b(i)or(b(i)*-(mx(i)>f)):ifmx(i)<.ormx(i)>mlthenmd(i)=abs(md(i))*sgn(rnd(1)-.5):a=mr(i):mr(i)=hm:my(i)=77+32*hm:hm=a:mx(i)=-ml*(md(i)<0):pokev2+1+i*2,my(i):du=peek(vc):data170,130,8,170,136,2,251,224,34,200,226,10
6 r=r+.25:dc=peek(vc):on-((dcand1)=.)goto2:li=li-1:gosub8:on-(li>0)goto2:pokev+21,0:pokepy,11:print:printtab(14)"{white}game over!":waitjo,127,127:run:data170,168,2,170,160,10,42,40,34,42,34,2,128,160,8,170,136,32,170,130,2,34,32,8,34,8,,128,128,,,,,,,,,,,,,,
7 print"{blue}{clear}{white}";:fori=0to4:pokepy,i*4+3:print:forj=0to12:print"{white}  .";:next:next:DATA34,,2,34,32,2,34,32,,170,128,40,170,138,2,251,224,2,59,32,42,170,170,2,170,160,42,42,42,2,,32,2,128,160,40,170,138,,170,128,2,34,32,2,34,32,,34,,,,,,,,
8 pokev+21,0:fori=0to5:pokepy,i*4+1:print:print"{blue}{reverse on}{right}{delete}{cm y*39}{left}{148}{cm y}{reverse off}";:next:fori=0to3:hx(i)=15:hy(i)=i*4+5:hd(i)=4*((iand1)-.5):mr(i)=i-(i>1):md(i)=bs*(int(rnd(1)*2)+1)*sgn(rnd(1)-.5)
9 my(i)=77+32*mr(i):mx(i)=-ml*(md(i)<0):pokev+i*2+2,mx(i)andf:pokev+i*2+3,my(i):pokepm+i,250:next:pokev+21,63:i=3:x=161:y=141:p=1522:pokev,x:pokev+1,y:du=peek(vc):print"{home}{white} score:"tab(15)"dents:{green}"li;tab(28)"{white}level:{green}"lv:hm=2:return

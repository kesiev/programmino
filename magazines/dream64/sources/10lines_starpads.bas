0n=53280:sy=65520:i=1:xp=11:xe=29:b$=" {down}{left}{reverse on}{cm g}{down}{left}{cm g}{down}{left}{cm g}{down}{left}{cm g}{down}{left}{reverse off} ":p=56320:y=12:w=20:z=13:v=53248:pOv+21,15:pOv+37,15:pOv+38,12:fOt=0to3:pOv+39+t,11:nE:pOv+29,15:pOv+23,15:pOv,70:pOv+1,80:pOv+2,118:pOv+3,80:pOv+4,70:pOv+5,122:pOv+6,118:pOv+7,122:pOv+33,0:pOv+27,15
1?"{clear}":goS8:u=1:v=1:m=1024:e=12:fOt=0to39:pOm+t,102:pOm+t+920,102:nE:dA0,0,42,0,0,170,0,2,170,0,10,170,0,42,170,0,170,170,0,170,170,2,170,170,2,170,170,10,170,170,10,170,170,42,170,170,42,170,170,42,170,170,42,170,170,170,170,168,170,170,168,170,170,168,170
2pO1044,32+23*(i<0):j=pE(p):y=y+(j=126)*i:y=y-(j=125)*i:y=-y*(y>0):ify>=18tHy=18:dA170,168,170,170,168,0,0,0,172,0,0,175,0,0,171,192,0,171,240,0,171,244,0,171,245,0,171,253,0,171,253,64,171,253,64,171,253,80,171,253,80,171,253,84,170,253,84,2,255,84,48,255
3pO780,0:pO781,y:pO782,xp:sYsy:?b$:pO780,0:pO781,e:pO782,xe:sYsy:?b$:ifw=xp+1aN(z>=yaNz<y+5)tHu=-u:s=s+1:dA84,252,63,85,255,63,85,231,63,85,219,63,85,219,63,85,219,0,0,170,170,168,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,42,170,170
4pOm+40*c+b,32:ifw=xe-1aN(z>=eaNz<e+5)tHu=-u:es=es+1:dA42,170,170,42,170,170,42,170,170,10,170,170,10,170,170,2,170,170,2,170,170,0,170,170,0,170,170,0,42,170,0,10,170,0,2,170,0,0,170,0,0,42,231,63,85,254,63,85,60,191,85,130,191,85,170
5pOn,2+i:pO780,0:pO781,z:pO782,w:sYsy:?"Q":b=w:c=z:w=w+u:v=v*(1+2*(z>21orz<2)):ifb>xetH?"{clear}    {light green}{162}{162}   remember, a jedi's strength{return}  {172}{reverse on}{160}{160}{160}{160}{reverse off}{187}   flows from the force!{return} {green}{127}{reverse on}{160}{183}{172}{187}{183}{160}{reverse off}{169}{return}  {188}{reverse on}{160}{160}{160}{160}{reverse off}{190}   your score:"+stR(s)+"{return}   {reverse on}{187}{183}{183}{172}{return}{return}press enter":inputa$:rU
6z=z+v:e=e-((z<e+3)-(z>e+3))*(u=-1orw>20-4*rN(.)):e=-e*(e>0):ife>18tHe=18:dA255,85,170,255,85,170,255,84,171,255,84,171,255,84,171,253,84,171,253,80,171,253,80,171,253,64,171,253,64,171,253,0,171,253,0,171,252,0,171,240,0,171,192,0,171,0,0,168,0,0
7i=2*(w>20aNrN(.)>.1)+1:on2+(w>=xp)gO2:?"{clear} {dark gray}{172}{reverse on}{163}{163}{reverse off}{187}  you have failed{return} {reverse on}{165}{168}{168}{170}{reverse off} for the last time{return} {reverse on}BWWB{return}{182}{reverse on}M{reverse off}{169}{127}{reverse on}N{reverse off}{181}{return}{188}{reverse on}{162}{163}{163}{162}{reverse off}{190}{return}{return}{yellow}hit enter":fOt=1to200:nE:?"{home}{return}{return}{return}{return}{return}{return}{return}"sP13)"{green}ED{sh asterisk}R{down}{left*4}{sh asterisk*4}>{down}{left*5}RF{sh asterisk}D":fOt=1to22:pO1361+t,64:pO55633+t,5:nE:pOn+1,1:pOn+1,0:inputa$:rU
8s$="{yellow}UE{reverse on}{162}{172}{reverse off}{190}{reverse on}{172}{187}{reverse off} {reverse on}{172}{reverse off}{187}{return}JI {161} {reverse on}{172}{187}{reverse off} {reverse on}{172}{reverse off}{187}{return}CK {190} {190}{188} {190}{190}{return}{176}I     UD{return}{171}K{reverse on}{172}{187}{reverse off} {reverse on}{172}{reverse off}{187}JI{return}{125} {reverse on}{172}{187}{reverse off} {reverse on}{188}{reverse off}{190}FK{return}":d=2040:ifpE(d)<>13tHpOd,13:pOd+1,14:pOd+2,15:pOd+3,192:pOv+28,15:fOt=1to3:fOq=0to62:rEa:pO64*(12+t)+q,a:nE:nE:fOq=0to62:rEa:pOq+(192*64),a:nE:?"{home}":fOt=1to20:?"":nE:?""
9s$(0)=s$:s$(1)="{yellow}{reverse on}star pads":s$(2)="{reverse on}in a galaxy far far away":s$(3)="{reverse on}an 8 bit system is burning":s$(4)="{reverse on}doing things it was not intended for":s$(8)="{reverse on}hit enter":l=-(40-len(s$(g)))*(g>0):?sPl/2)s$(g):g=g-(g<8):gEa$:fOt=0to200:nE:on2+(a$="")gO9:?"{clear}":reT
20rem y=y player paddle y, w and z balls cohordinates, b and c previous balls cohordinates, e=enemy paddle y
30rem u = 1 if ball going right, -1 if left, v=1 if ball going up,-1 if down,s=score,es=enemy score. i=inversion factor

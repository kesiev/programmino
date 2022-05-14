0 print"use , . space":wait198,1:y=1063:c=54272:poke53280,2:poke53281,0:print"{brn}{clr}":poke214,20
1 geta$:l=5:r=37:print:poke2023,86:a$(0)="    ":a$(1)="Z   ":a$(2)="ZZ  ":a$(3)="ZZZ "
2 a=3:pokec+24,15:pokec+5,19:pokec+6,68:pokec+1,10:c$=chr$(13):p=1053:z=rnd(-ti)
3 printc$"   {down}{left}{left}{left}    {down}{up}{up}"c$a$(a)c$s$spc(l-e)"{brn}VV"spc(k)"{gry1}W{brn}"spc(r-l-3-k)"VV{up}{up}{wht}";
4 pokec+4,129:pokec+4,128:   ifpeek(p)<>32thenprint"{home}{down}{down}{down}{wht}*** you dead ***{brn}":end
5 pokep,88:pokep+c,1:geta$:ifa$=","ora$="."thenp=p-1-2*(a$="."):p=p+(p>y)
6 ifa$=" "anda>=1thena=a-1:fori=1to13:t=p+40*i:ifpeek(t)<>86thenpoket,90:poket-40,32:next
7 l=l-((l>5)*(rnd(1)<.2+l/200))+((l<30)*(rnd(1)<.2)):ifr-l<9thenr=r+1:goto9
8 r=r-((r>8)*(rnd(1)<.2+r/200))+((r<37)*(rnd(1)<.2))
9 k=(r-l-3)*rnd(1):s=s+.1:v=int(s):s$=str$(v):e=len(s$):a=a-(a<3)*.0125:goto3
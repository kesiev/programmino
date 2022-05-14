10 poke53280,0:poke53281,0:print"{wht}{clr}{rvon}petscii artist{rvof} by logiker":print:d=5:hf=.5:print"please select:":print:print"1) predefined objects":print"2) advanced settings":print:inputs:print:ifs=2goto30
20 print"please select:":print:print"1) square":print"2) colored square":print"3) circle":print"4) colored circle":print"5) donut":print"6) colored donut":print:inputs:d=16:r=256:f$=chr$(78-11*((s/2)=int(s/2))):a$="y":c$=chr$(78-11*(s>2)):h$=chr$(78-11*(s>4)):s=0:goto50
30 input"circle (y/n, n)";c$:input"dimension (2-24, 5)";d:input "reverse (y/n, n)";r$:r=-(r$="y")*128:input "non reverse (y/n, y)";n$:s=-(n$="n")*128:r=r-(n$<>"n")*128:r=r-(r=0)*128:input"hole (y/n, n)";h$:ifh$="y"theninput"hole factor (0.05-0.95, 0.5)";hf
40 input "allow letters and numbers (y/n, n)";l$:input"color (y/n, n)";f$:dimc(15):iff$="y"theninput"all colors (y/n, y)";a$:ifa$="n"thenfori=1to15:poke646,i:printi;spc(-(i<10))"{left}{rvon}      {rvof} {wht}";:next:print:input"how many colors (1-14)";cc:fori=1tocc:print"color "i;:inputc(i):next
50 m=.5+d/2:print"{clr}":fory=1tod:forx=1tod
60 w=s+rnd(0)*r:on-(w=32)goto60:v=wand127:on-((l$<>"y")and((v<27andv>0)or(v>47andv<58)))goto60:ifc$="y"theni=m-x:j=m-y:k=i*i+j*j:ifk>m*mthen90
70 ifh$="y"theni=m-x:j=m-y:k=i*i+j*j:n=m*hf:ifk<n*nthen90
80 poke1024+y*40+x,w:iff$="y"anda$<>"n"thenpoke55296+y*40+x,rnd(0)*15+1
90 ifa$="n"thenpoke55296+y*40+x,c(rnd(0)*cc+1)
100 next:print:next:poke198,0:wait198,1:run
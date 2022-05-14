100 poke53281,14:print"{clr}":poke 53281,6:dima(999),b(255):fori=1to8:readj,b(j)
140 next:fori=0to39:j=int(i/1.6)*40:poke1024+i,42:poke2023-i,42:poke1984-j,42
150 poke1063+j,42:next:forw=1to3step0:a(w)=int(rnd(1)*999)+1024:j=peek(a(w))=32
250 pokea(w),42:w=w-j:next:b=2:a=1:r=32:h=1447:pokeh,102
260 forl=1to0step0:l=0:for i=a to b:for j = 1 to 4
300 ifpeek(a(i)+b(j))=32thenl=l+1:a(b+l)=a(i)+b(j):pokea(b+l),42
320 next:get r$:c=asc(r$+"{$20}"):d=b(c):if c=13 then r=91
325 if peek(h+d)=32thenpokeh,r:h=h+d:r=peek(h):pokeh,102
330 next:a=b:b=b+l:data1,1,2,-1,3,40,4,-40,29,1,157,-1,145,-40,17,40
350 next:print "{clr}{$43}{$4f}{$4e}{$47}{$52}{$41}{$54}{$55}{$4c}{$41}{$54}{$49}{$4f}{$4e}{$53}{$2e}{$20}{$59}{$4f}{$55}{$52}{$20}{$53}{$43}{$4f}{$52}{$45}{$20}{$49}{$53}" 874-b:end
10 data"zx80",-1980,1,2,"amiga500",-1987,512,4096,"cpc464",-1984,64,27,"atari400",-1979,8
20 data128,"ti99/4a",-1981,16,16,"vc20",-1980,5,16,"c-64",-1982,64,16,"c=128",-1985,128,16
30 print"{clr}{wht}{rvon}{$4c}{$4f}{$47}{$49}{rvof}{$54}{$52}{$55}{$4d}{$50}{$53}{down}":p=0:c=0:u=1:r=4:e=4:fori=0to7:readt$(i):forf=0to2:reada(i,f):next
40 z=-(rnd(0)*(c<4)>rnd(0)*(p<4)):p=p+z:c=c+1-z:p(i)=p*z:c(i)=c*(1-z):next:poke53281,11
50 n=n+1:p=0:c=0:fori=0to7:c=c-(c(i)=n)*i:p=p-(p(i)=n)*i:next:b=-(a(c,2)>16)*2
60 printr"{$3a}"e:print"{yel}"t$(p)"{$0d}{$20}1{$29}"a(p,0)*-1"{$0d}{$20}2{$29}"a(p,1)"{$4b}{$42}{$0d}{$20}3{$29}"a(p,2)"{$43}{$4f}{$4c}{wht}":ifutheninputb:b=b-1
70 print"{lred}"t$(c)a(c,0)*-1a(c,1)"{$4b}{$42}"a(c,2)"{$43}{$4f}{$4c}{wht}{$20}"b+1"{down}":s$(0)="{$4c}{$4f}{$53}{$54}":s$(8)="{$57}{$4f}{$4e}"
80 p(p)=n+r:c(c)=n+e:ifa(p,b)>a(c,b)thenprint"{rvon}{$3a}{$2d}{$29}{rvof}":p(c)=n+r+1:c(c)=0:r=r+1:e=e-1:u=1
90 ifa(p,b)<a(c,b)thenprint"{rvon}{$3a}{$2d}{$28}{rvof}":c(p)=n+e+1:p(p)=0:r=r-1:e=e+1:u=0:wait198,1:poke198,0
100 on-((r>0)and(e>0))goto50:printr"{$3a}"e:print"{$47}{$41}{$4d}{$45}{$20}{$4f}{$56}{$45}{$52}":print"{$59}{$4f}{$55}{$20}";s$(r):input:run
2020 rem (c) logiker 2020
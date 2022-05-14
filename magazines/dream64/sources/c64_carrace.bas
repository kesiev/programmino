10 rem car race random outcome
20 rem vic=53248
30 for y=1 to 63*2
40 read dt
50 poke 831+y,dt
60 next
65 poke 646,12
75 print chr$(147);
100 rem  - sprite 1
101 data 0,0,0,0,0
102 data 0,0,0,0,0,0,0,0
103 data 0,0,0,0,0,0,0,0
104 data 0,0,0,0,10,0,0,21
105 data 160,0,85,80,2,85,80,42
106 data 170,104,170,170,168,154,170,168
107 data 154,170,152,86,170,84,84,0
108 data 84,84,0,84,16,0,16,0,0,0,0
109 rem  - sprite 2
110 data 0,0,0,0,0
111 data 0,0,0,0,0,0,0,0
112 data 0,0,0,0,0,0,0,0
113 data 0,0,0,0,160,0,10,84
114 data 0,5,85,0,5,85,128,41
115 data 170,168,42,170,170,42,170,166
116 data 38,170,166,21,170,149,21,0
117 data 21,21,0,21,4,0,4,0,0,0,0
200 for n=0 to 7
210 poke 2040+n,13:next
220 poke 53248+0,88
230 poke 53248+2,88
240 poke 53248+4,88
250 poke 53248+6,88
260 poke 53248+8,88
270 poke 53248+10,88
280 poke 53248+12,88
290 poke 53248+14,88
300 poke 53248+23,255
305 poke 53248+29,255
310 poke 53248+28,255
320 poke 53248+16,255
330 poke 53248+21,255
335 poke 53248+37,0
340 for n=0 to 7
345 poke 53248+39+n,n
348 if n=6 then poke 53248+39+n,8
349 if n=0 then poke 53248+39+n,9
350 poke 53248+n*2+1,32+25*n:next
400 for n=0 to 7
410 for x=255+88 to 24 step -10
420 z=peek(53248+16)
430 if x>255 then 450
440 poke 53248+16,z and not 2^n
450 if x<256 then 470
460 poke 53248+16,z or 2^n
470 if x>255 then poke 53248+2*n,x-255
480 if x<256 then poke 53248+2*n,x
490 next:poke 2040+n,14:next
500 for y=0 to 24:poke 1024+34+40*y,81:next
505 poke 214,10:print:poke 211,19
508 print "place your bet."
510 poke 214,11:print:poke 211,19
520 print"press keyboard"
530 poke 214,12:print:poke 211,19
540 print "to start race"
600 get kb$:if kb$="" then 600
700 r=int(rnd(1)*8)
710 poke 53248+r*2,peek(53248+r*2) + 5
715 if peek(53248+r*2)>250 then goto 800
720 goto 700
800 poke 646,1
801 if peek(53248+0*2)>250 then print "brown car won!"
802 if peek(53248+1*2)>250 then print "white car won!"
803 if peek(53248+2*2)>250 then print "red car won!"
804 if peek(53248+3*2)>250 then print "cyan car won!"
805 if peek(53248+4*2)>250 then print "prink car won!"
806 if peek(53248+5*2)>250 then print "green car won!"
807 if peek(53248+6*2)>250 then print "light brown car won!"
808 if peek(53248+7*2)>250 then print "yellow car won!"
809 get kb$:if kb$="" then 809
820 goto 65
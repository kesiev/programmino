    0 GOTO 2
    1 LET e=1+INT (RND*3): LET a=1+1*(PEEK 23560=114)+2*(PEEK 23560=112)+3*(PEEK 23560=115): PRINT INK 2+2*(t<1);AT 7,15;INT (t/10); INK 4*(t>0);AT 10,14;a$(a);AT 10,16;z$(e): BEEP .35*(t<5),1: LET t=t-1: BEEP .03*(INKEY$<>""),5: GO TO 1+4*(t<0): REM ************               * RUN 2 TO *  by azi2020   *   START  *               ************
    2 BORDER 5: PAPER 4: CLEAR : RESTORE : PRINT AT 15,0; PAPER 7;"USE R TO CHOOSE ROCK,P FOR PAPERAND S FOR SCISSORS. BEAT EACH OFTHE 3 BOSSES AND THEN CONFRONT  THE BIG ONE.",,: LET z$="\d\e\f\e": LET a$="\a\a\b\c": LET a=1: LET n$="\i\o\c": LET n=1: LET w=0: FOR z=65368 TO 65487: READ x: POKE z,x: NEXT z
    3 RESTORE : LET t=59: PRINT AT 20,0; PAPER 6;"  ROCK>SCISSORS>PAPER>ROCK ...  "; PAPER 4; INK RND*4;AT 10,13;"PRESS";AT 11,13;"A KEY": GO TO 4-1*(INKEY$="")
    4 PRINT AT 2,13;"BOSS";n;AT 10,13;"\g   ";n$(n);AT 11,13;"\h   \j": GO TO 1
    5 IF (a=1 AND e=3) OR (a=2 AND e=3) OR (a=3 AND e=1) OR (a=4 AND e=2) OR (a=4 AND e=4) THEN LET w=w+1: LET n=n+(w=3)
    6 IF (e=1 AND a=4) OR (e=2 AND a=1) OR (e=2 AND a=2) OR (e=3 AND a=3) OR (e=4 AND a=1) OR (e=4 AND a=2) THEN LET w=w-1: IF w<0 THEN FOR z=0 TO 249: NEXT z: PRINT FLASH 1;AT 10,13;" GAME";AT 11,13;"OVER!": FOR z=0 TO 499: NEXT z: RUN 2
    7 PRINT AT 3,13;" xxx"(1 TO w+1);" ": LET w=w-3*(w=3): FOR z=0 TO 399: NEXT z: PRINT AT 2,13;"     " AND w=0;AT 3,14;"   " AND w=0: GO TO 3+5*(n=4)
    8 PRINT AT 10,14;"  \k\l";AT 11,16;"\m\n": FOR z=99 TO 99+RND*799: NEXT z: PRINT AT 10,15;"\k\l=";AT 11,15;"\m\n=": IF INKEY$<>"r" THEN PRINT AT 10,14;"\k\l= ";AT 11,14;"\m\n= ": LET e=1: LET a=4: GO TO 6
    9 PRINT AT 10,14;"\a";AT 0,0; FLASH 1; PAPER 2;"           YOU WIN!!!           ": FOR z=0 TO 59: BORDER RND*7: BEEP .05,RND*35: NEXT z: RUN 2
    10 DATA 0,0,0,30,33,69,137,246,196,170,85,74,69,67,188,192,40,84,84,84,92,122,138,252,0,0,0,120,132,162,145,111,35,85,170,82,162,194,61,3,20,42,42,42,58,94,81,63,60,126,255,250,214,213,241,238,59,127,254,158,158,122,149,231,84,170,171,169,223,145,78,36,220,254,127,121,121,94,185,231,2,5,25,37,66,80,129,230,0,240,12,2,1,1,1,1,168,242,172,72,49,70,248,224,1,129,129,66,162,18,15,3,84,170,171,171,131,129,66,36
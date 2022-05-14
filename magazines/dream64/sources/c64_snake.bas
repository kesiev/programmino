10 REM Snake variables
20 ms=683:                              REM Maximum snake size
30 sl=1:                                REM Snake Llngth
40 DIM sa(ms):                          REM Snake array to store body positions
50 px=20:                               REM Initial X coordinate
60 py=13:                               REM Initial Y coordinate
70 sa(0)=1024+(py*40)+px:               REM Initial position on screen

80 REM Directions
90 dx=0:                                REM X direction modifier
100 dy=0:                               REM Y direction modifier
110 d$="":                              REM String representation of direction

120 REM Other variables
130 s=0:                                REM Score
140 f=0:                                REM Food on board (0=no: 1=yes)
150 fs=5:                               REM Score per food

160 REM Screen variables
170 ss=1185:                            REM Board start
180 se=1942:                            REM Board end

200 REM Initialisation
210 POKE 53280,0:POKE 53281,0:          REM Set Background to black
220 POKE 646,13:                        REM Set Foreground to green 
230 PRINT CHR$(147):                    REM Clear Screen
240 GOSUB 9500:                         REM Show start screen
250 T=PEEK(197):IF T=64 THEN 250:       REM Wait for input
260 PRINT CHR$(147)
270 GOSUB 9000:                         REM Print Game Screen
280 GOTO 500:                           REM Start Game

500 REM MAIN LOOP
510   GOSUB 1000:                       REM Get direction
520   POKE sa(sl-1),32:                 REM Remove tail
530   GOSUB 2000:                       REM Move player
540   POKE sa(0),160:                   REM Draw Snake head
550   GOSUB 4000:                       REM Spawn food
560   GOTO 500  
600 END

1000 REM KEYBOARD CHECK
1010   T=PEEK(197):IF T=64 THEN GOTO 1070
1030   IF NOT (T=9) THEN GOTO 1040:     REM Check if key = "w"
1035   dx=0:dy=-1:d$="u"
1040   IF NOT (T=10) THEN GOTO 1050:    REM Check if key = "a"
1045   dx=-1:dy=0:d$="l"
1050   IF NOT (T=13) THEN GOTO 1060:    REM Check if key = "s"
1055   dx=0:dy=1:d$="r"
1060   IF NOT (T=18) THEN GOTO 1070:    REM Check if key = "d"
1065   dx=1:dy=0:d$="d"
1070   POKE 198,0:                      REM Clear Keyboardbuffer
1100 RETURN

2000 REM MOVE PLAYER
2010   IF d$="" THEN GOTO 2200:         REM do nothing at start
2020   REM Calculate new position
2040   py=py+dy
2050   px=px+dx
2052   hp=1024+(py*40)+px:              REM New Snakehead position
2055   c=PEEK(hp):                      REM Get character at new position
2060   IF c=160 OR sl=ms THEN GOTO 8000:REM If the character is a wall, show game over
2070   IF c=42 THEN GOSUB 5000:         REM If the character is a fruit, eat
2080   FOR x=sl TO 1 STEP -1:           REM iterate over snake
2090     sa(x)=sa(x-1):                 REM Shift value to next snake part
2100   NEXT
2110   sa(0)=hp
2120   sa(sl)=0
2200 RETURN

4000 REM SPAWN FOOD
4010   IF f=1 THEN GOTO 4100:           REM If food is already there do nothing
4020   fp=INT(RND(1)*1000)+1024:        REM Get random position
4030   IF fp<ss OR fp>se OR PEEK(fp)<>32 THEN GOTO 4020
4040   POKE fp,42:                      REM Place food
4050   f=1
4100 RETURN

5000 REM EAT FOOD
5010   f=0
5020   s=s+fs:                          REM increase score
5022   sl=sl+1:                         REM grow
5025   GOSUB 6000:                      REM Draw score
5030 RETURN

6000 REM DRAW SCORE
6010   s$=STR$(s)
6020   FOR x=LEN(s$) TO 1 STEP -1
6030     POKE (1102-LEN(s$))+x,(48+VAL(MID$(s$,x,1)))
6040   NEXT
6050 RETURN

8000 REM GAME OVER
8010   PRINT CHR$(147)
8020   PRINT " "
8030   PRINT " "
8040   PRINT " "
8050   PRINT " "
8060   PRINT " "
8070   PRINT " "
8080   PRINT " "
8085   PRINT " "
8090   PRINT " "
8100   PRINT "               game over!              "
8110   PRINT "            final score:";s;"          "
8120   PRINT "        type 'run' to try again.      "
8130   PRINT " "
8140   PRINT " "
8150   PRINT " "
8160   PRINT " "
8170   PRINT " "
8175   PRINT " "
8180   PRINT " "
8190   PRINT " "
8200   POKE 53280,254: POKE 53281,246:     REM Reset background color
8210   POKE 646,14:                        REM Reset Foreground color
8300 END

9000 REM GAME SCREEN
9010   PRINT "                                  score ";
9020   PRINT "                                  00000 ";
9030   PRINT "                                        ";
9040   PRINT "{reverse on}                                        ";
9050   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9060   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9070   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9080   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9090   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9100   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9110   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9120   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9130   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9140   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9150   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9160   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9170   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9180   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9190   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9200   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9210   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9220   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9230   PRINT "{reverse off}{reverse on} {reverse off}                                      {reverse on} ";
9240   PRINT "{reverse off}{reverse on}                                        ";
9260 RETURN

9500 REM START SCREEN
9510   PRINT " "
9520   PRINT " "
9530   PRINT " "
9540   PRINT " "
9550   PRINT " "
9560   PRINT "   {175}{175}{175}{175}{175}{175}{175}{175}{175}              {175}{175}           "
9570   PRINT "  N   {175}{175}{175}{175}{175}N {175}{175}{175}{175} {175}{175}{175}{175}{175}  B  B {175}{175} {175}{175}{175}{175}  "
9580   PRINT "  M{175}{175}{175}{175}{175}  M N    MM{175}{175}  M B  BN NN {175}{175} M "
9590   PRINT "  N        M   B  MN {175}{175} MB    <M  {175}{175}{175}N "
9600   PRINT " N{175}{175}{175}{175}{175}{175}{175}  N{175}{175}{175}B  ({175}{175}{175}{175}  N{175}{175}B{175} MM{175}{175}{175}  >"
9610   PRINT "         MN     MN     MN     MN    MN "
9620   PRINT " "
9630   PRINT " "
9640   PRINT " "
9650   PRINT " "
9660   PRINT " "
9670   PRINT "  control your snake by using w,a,s,d!"
9680   PRINT " "
9690   PRINT "        press any key to start."
9700 RETURN
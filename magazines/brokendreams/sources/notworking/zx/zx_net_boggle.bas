0 REM Remove lines 0,1,2 before running ZXtext2P; enter 1,2 manually on ZX81.
1 REM 5K? GOSUB ?�RND<\' CHR$ \ ' GOSUB %KTAN
2 REM E�RND)K?\' CHR$ \ '7 GOSUB %KTAN
3 POKE 16516,117
4 POKE 16518,91
5 POKE 16539,117
6 LET STO=16534
7 LET RET=16514
8 GOSUB 700
9 PRINT AT 3,11;"\@@\!!\!!\!!\!!\!!\!!\!!\!!\##",TAB 11;"\@@\::%B%O%G%G%L%E\::\##",TAB 11;"\@@\;;\;;\;;\;;\;;\;;\;;\;;\##"
10 PRINT AT 10,1;"PLEASE WAIT A WHILE AS I MUST",,,TAB 6;"WORK OUT THE BOARD"
11 PRINT AT 14,1;"THE SCREEN WILL GO BLANK FOR",,,TAB 6;"ABOUT HALF A MINUTE"
12 PRINT AT 18,7;"\@@\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\~~\##",TAB 7;"\@@ BY J.WINCHESTER \##",TAB 7;"\@@\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\,,\##"
14 FOR P=1 TO 300
15 NEXT P
17 CLS
18 FAST
19 FOR P=0 TO 20
20 PRINT AT P,0;"\##"
30 PRINT AT P,5;"\##"
40 PRINT AT P,10;"\##"
50 PRINT AT P,15;"\##"
55 PRINT AT P,20;"\##"
60 NEXT P
62 PRINT AT 1,22;"\:'\''\''\''\''\''\''\''\''\':"
63 PRINT  TAB 22;"\: \  \  \  \  \  \  \  \  \ :"
64 PRINT  TAB 22;"\: \  \  \  \  \  \  \  \  \ :"
65 PRINT  TAB 22;"\: \  BOGGLE\  \ :"
66 PRINT  TAB 22;"\: \  \  \  \  \  \  \  \  \ :"
67 PRINT  TAB 22;"\: \  \  \  \  \  \  \  \  \ :"
68 PRINT  TAB 22;"\:.\..\..\..\..\..\..\..\..\.:"
70 LET P$="\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##\##"
80 PRINT AT 0,0;P$;AT 5,0;P$;AT 10,0;P$;AT 15,0;P$;AT 20,0;P$
100 DIM A$(16,6)
105 LET A$(1)="YFEHIE"
107 LET A$(2)="LUKEYG"
109 LET A$(3)="SAHOMR"
111 LET A$(4)="GURILU"
113 LET A$(5)="TUSEPL"
114 LET A$(6)="ROMAHS"
115 LET A$(7)="YLTBAI"
117 LET A$(8)="NEDAVZ"
119 LET A$(9)="AMOQJB"
121 LET A$(10)="RCLSAE"
123 LET A$(11)="DONUTK"
125 LET A$(12)="FIROBX"
126 LET Y=41
127 LET A$(13)="DONESW"
129 LET A$(14)="INEGVT"
131 LET A$(15)="TOCAAI"
132 LET A$(16)="MCDPAE"
134 DIM D$(16)
135 LET X=2
136 LET Y=42
140 DIM C$(16,2)
142 FOR P=1 TO 16
143 LET D$(P)="0"
144 NEXT P
145 FOR D=1 TO 16
146 LET A=INT (RND*16)+1
148 IF D$(A)="1" THEN GOTO 146
150 LET C$(D)=STR$ A
151 LET D$(A)="1"
152 NEXT D
200 FOR P=1 TO 16
210 LET R$=A$(VAL C$(P,1 TO 2),INT(RND*6)+1)
215 IF R$="Q" THEN PRINT AT 23-Y/2,X/2+2;"U"
260 LET A=7680+8*CODE R$
270 FOR C=A TO A+7
280 LET B=PEEK C
290 IF C/2=INT C/2 THEN LET Y=Y-1
300 FOR N=1 TO 8
310 LET B=2*(B-256*INT(B/256))
320 IF B>=256 THEN PLOT X+N-1,Y
330 NEXT N
380 NEXT C
400 LET X=X+10
410 LET Y=Y+8
415 IF X>40 THEN LET Y=Y-10
420 IF X>40 THEN LET X=2
450 NEXT P
451 SLOW
500 LET KO=USR STO
505 FOR P=1 TO 64
510 FOR O=1 TO 43
515 NEXT O
520 PLOT 54+9*SIN(P/32*PI),10+9*COS(P/32*PI)
540 NEXT P
550 CLS
560 PRINT AT 4,6;"\::\::\::\::\::\  \::\  \::\  \  \  \::\  \::\::\::\::";TAB 6;"\  \  \::\  \  \  \::\  \::\::\  \::\::\  \::"
570 PRINT  TAB 6;"\  \  \::\  \  \  \::\  \::\  \::\  \::\  \::\::\::"; TAB 6;"\  \  \::\  \  \  \::\  \::\  \  \  \::\  \::"
580 PRINT  TAB 6;"\  \  \::\  \  \  \::\  \::\  \  \  \::\  \::\::\::\::"
590 PRINT ,,TAB 11;"\::\  \  \  \::\  \::\::\::\::";TAB 11;"\::\  \  \  \::\  \::\  \  \::"
600 PRINT   TAB 11;"\::\  \  \  \::\  \::\::\::\::";TAB 11;"\::\  \  \  \::\  \::"
610 PRINT   TAB 11;"\  \::\::\::\  \  \::"
620 FOR P=1 TO 175
630 NEXT P
640 LET KO=USR RET
650 PRINT AT 10,22;"PRESS ANY";TAB 22;"KEY TO";TAB 22;"RESTART"
655 IF INKEY$="" THEN GOTO 655
656 FAST
680 GOTO 16
700 PRINT AT 3,10;"B O G G L E"
705 PRINT AT 8,7;"(INSTRUCTIONS? Y/N)"
710 INPUT S$
720 CLS
730 IF S$="N" THEN RETURN
735 PRINT "BOGGLE IS FOR 2 OR MORE PEOPLE."
740 PRINT "I WILL PRINT UP A 4 BY 4 GRID OF"
745 PRINT "LETTERS. YOU HAVE A TIME LIMIT"
750 PRINT "(SHOWN BY THE CLOCK),IN WHICH"
755 PRINT "YOU MUST FIND AS MANY HIDDEN "
760 PRINT "WORDS AS YOU CAN  (MINIMUM OF 3"
765 PRINT "LETTERS).   THE LETTERS MUST"
770 PRINT "BE TOUCHING EACH OTHER ON THE"
775 PRINT "BOARD. EG TO GET \"HELLO\" THE H"
780 PRINT "MUST EITHER BE ABOVE,BELOW, OR"
785 PRINT "BESIDE THE E(A DIAGONAL LINK UP"
790 PRINT "IS VALID), THE L MUST SIMILARLY "
800 PRINT "LINK UP WITH THE E, ALTHOUGH THE"
805 PRINT "L NEED NOT LINK WITH THE H"
810 PRINT "THE NEXT L %C%A%N%N%O%T BE THE SAME L"
815 PRINT "AS BEFORE, NOR CAN ANY LETTERS"
820 PRINT "IN THE SAME WORD UNLESS THEY"
825 PRINT "GENUINELY APPEAR TWICE. FINALLY"
830 PRINT "THE O MUST LINK WITH THE L"
835 PRINT "TO GIVE \"HELLO\"."
836 PRINT AT 21,0;"PRESS A KEY TO GO ON"
837 IF INKEY$="" THEN GOTO 837
838 CLS
840 PRINT "WHEN YOUR TIME IS FINISHED ( I "
845 PRINT "WILL LET YOU KNOW), EACH PLAYER"
850 PRINT "READS ALOUD THE WORDS HE\"S GOT."
855 PRINT "IF ANY ONE ELSE ALSO HAS THAT"
860 PRINT "WORD THEN EVERYONE CROSSES THAT"
865 PRINT "WORD FROM THEIR LISTS."
870 PRINT "FOR ANY WORD NOBODY ELSE HAS"
875 PRINT "ALSO GOT THAT PLAYER RECEIVES A"
880 PRINT "SCORE AS FOLLOWS"
890 PRINT  TAB 3;"3,4 LETTERS =1"
900 PRINT  TAB 3;"5 LETTERS   =2"
1000 PRINT TAB 3;"5 LETTERS   =3"
1005 PRINT TAB 3;"7 LETTERS   =5"
1010 PRINT TAB 3;"8 LETTERS   =11"
1050 PRINT "USUALLY AT LEAST 4 BOARDS ARE"
1055 PRINT "PLAYED, WITH THE WINNER HAVING"
1060 PRINT "THE LARGEST TOTAL OF POINTS AT"
1070 PRINT "THE END."
1080 PRINT "PS. A Q COUNTS AS A QU AND AS"
1090 PRINT "2 LETTERS IF INCLUDED IN A WORD"
1100 PRINT AT 20,0;"PRESS A KEY TO PLAY THE GAME"
1105 IF INKEY$="" THEN GOTO 1105
1110 CLS
1120 RETURN
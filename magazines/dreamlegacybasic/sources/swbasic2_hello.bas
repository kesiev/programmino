10  PRINT
20  PRINT TAB(28);"WELCOME TO PROGRAMMINO!":PRINT
30  PRINT TAB(36);"***":PRINT
40  PRINT TAB(15);"A CURSED INTERPRETER WRITTEN IN JAVASCRIPT"
50  PRINT:PRINT:PRINT
60  INPUT "PLEASE ENTER YOUR FIRST NAME";F$
70  INPUT "PLEASE ENTER YOUR LAST NAME";L$
80  INPUT "INPUT A NUMBER 1-20";N
90  IF N<1 OR N>20 THEN PRINT "WRONG NUMBER... TRY AGAIN!":GOTO 80
100 PRINT
110 FOR I=1 TO N
120 PRINT I;"HELLO ";F$;" ";L$;"!"
130 NEXT I
140 END
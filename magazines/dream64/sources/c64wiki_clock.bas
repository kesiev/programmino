10 REM Clock simulation, cancel with RUN/STOP
20 TIME$="235800" : REM Setting a new time for overflow!
30 T$=TIME$ : REM Save the time to avoid a overflow!
40 PRINT CHR$(147);
50 PRINT LEFT$(T$,2);":";
60 PRINT MID$(T$,3,2);":";
70 PRINT RIGHT$(T$,2)
80 GOTO 30
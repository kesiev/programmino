10 BORDER 0: PAPER 0: INK 7: CLS : REM black out screen
20 LET x1=0: LET y1=0: REM start of line
30 LET c=1 : REM for ink colour, starting blue
40 LET x2=INT (RND*256): LET y2=INT (RND*176): REM
50 DRAW INK c;x2-x1,y2-y1
60 LET x1=x2: LET y1=y2: REM next line starts where last one
70 LET c=c+1 : IF c=8 THEN LET c=1 : REM new colour
80 GO TO 40
1le=1:pO53280,0:pO53281,0:?chr$(147):?"hopman":?" by onlineprof2010":?"--------------":?"1 - grassland":?"2 - jungle":?"3 - polar":?"4 - swamp":?"5 - cave":?"6+ random":?"enter zone":inputw:pO53286,15
2dIl(4),h(4),v(4),z1(5),z2(5),z3(5),z4(5):fOi=0to7:pO2040+i,255:pO53287+i,i:nE:fOi=0to3:rEl(i):rEh(i):rEv(i):nE:s=rN(-w):fOi=16321to16382:pOi,0:nE:pO16320,15:pO16323,15:pO16326,15:pO16329,15:fOi=0to4:rEz1(i):rEz2(i):rEz3(i)::rEz4(i):nE
3fOi=1to7:pO2*i+53248,int(rN(1)*30)+i*30+10:pO2*i+53249,int(rN(1)*130)+90:nE:pO53281,z1(w-int(w/5)*5):pO646,z4(w-int(w/5)*5):?chr$(147):x=30:y=80:pO53269,255:pO53248,x:pO53249,y:nu=int(rN(1)*8)+10:pO53278,0
4fOi=0tonu:lt=int(rN(1)*5)+4:ro=int(rN(1)*15)+1:co=int(rN(1)*29):lo=1024+co+ro*40:forj=0tolt:pOlo+(j*40),93:nE:nE:nu=int(rN(1)*8)+10:pO646,1:?"zone"w"-"le"time"t"gems"sc
5fOi=0tonu:lt=int(rN(1)*10)+4:ro=int(rN(1)*19)+3:co=int(rN(1)*29):lo=1024+co+ro*40:forj=0tolt:pOlo+j,160:pOlo+j+54272,z3(w-int(w/5)*5):nE:pOlo,95:pOlo+j-1,105:nE:fOi=1904to2023:pOi,160:pOi+54272,z2(w-int(w/5)*5):nE:?chr$(19)
6pl=pE(53279)aN1:fOi=0to3:if((pE(56320)aNl(i))=0)tHo=o+h(i):u=u+(pl*v(i))
7nE:pO53276,0:cc=pE(53278):ifcc>0tHcc=cc-1:pO53269,pE(53269)aN(nO(cc)aN255):sc=sc+10:pO54276,0:pO54277,0:pO54296,10:pO54276,17:pO54277,122:pO54273,24:pO54272,124:pO53278,0
8pO53248,x:pO53249,y:p=p-(p<5):p=p-(p*pl):ify>220orle>4thenpO53269,0:?chr$(147):?"game over":?"----------":?"gems"sc:?"time"t:?"levels"le:?"final rating is"(((le-2)*100)+sc)/(t/10):eN
9ifx<250thenx=x+o:o=0:p=p+u:y=y+p:u=0:t=t+1:pO54296,0:pO53276,254:gO6:dA16,0,-4,4,-3,0,8,3,0,2,0,3
10pO54276,0:pO54277,0:pO54296,10:pO54276,17:pO54277,122:pO54273,24:pO54272,124:le=le+1:onlegO3,3,3,3,8:dA0,2,12,14,3,6,9,13,13,9,5,15,14,6,1,1,15,9,5,13
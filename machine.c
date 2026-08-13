#include <stdio.h>
#include <conio.h>
#include <math.h>
//#include <iostream.h>

#define pi 3.141592654
#define muo 0.000001256

int i,type;
float Et,K,KVA,m,Bm,Ki,f,PHlm,Ai,Agi,ct,d,p,q,r,s;
/*
Et = Voltage per turn
KVA = kVA ratings
Bm = Flux density in the core
Ki = stacking factor
f = Frequency of the line voltage
m = number of phases
PHlm = Flux in the core
Ai = Net iron area
Agi = Gross iron area
ct = Type of core
d= diameter of the core
p,q,r,s = dimension of the core
*/

float KV,Kw,delta,ratio1,Aw,Hw,Ww,D;
/*
KV = primary winding voltage
Kw = window space factor
delta = Current density in the winding
Aw = window area
ratio1 = ratio height to width of the window
Hw = height of the window
Ww = width of the window
D = diameter b?w the adjacent core centers
*/

float FDy,Ay,Agy,Dy,Hy;
/*
FDy = flux density in the yoke
Ay = area of the yoke
Agy = gross area of the yoke
Dy = Depth of the yoke
Hy = Height of the Yoke
*/

float H,W,Df;
/*
H =Height of the Frame
W = Width of the Frame
Df = depth of the Frame
*/

float Vls,Ctype;
float Vsp,Isp,Ts,Ts1,as,x,y,delta1,as1,z,X1,Y1,Lcs;
float cls,cly,bs,di,dc,lvi,Id,Od,st;
int c,lay;
/*
Vls  = secondary line voltage
Ctype = core type
Isp = secondary current per phase
Ts = turn per phase
Vsp = secondary voltage per phase
as= area of the secondary conductor
x,y = Dimension of secondary conductor
delta1 = Modified current density
as1 = modified area of the secondary conductor
z =covering of the conductor
x1,y1 = dimension of the conductor with proper lamination
Ts1 = Turns along the axial depth
lay = Number of layers b/w the conductor
Lcs = axial depth of the winding
cls = clearance b/w the winding
cly = thickness of the pressboard winding
di  = insulation for the circumscribing circle
dc = diameter of the circumscribing circle
Id = Insde diameter
Od = Outside diameter
Ivi = insulation b/w winding and core
st = number of strip
*/

int c1,Tp,Nc;
float Vlp,Vpp,Vc,Vc1,Ncn,Nct,Tp1,Tp2,tp,tc,Ncl,Tncl,Ipp,ap,ap1;
float dp,dp1,dp2,Hlp,dbc,Lcp,clc,ti,bp,T,IDhv,ODhv,con,stp,ca,cr,dp3;
/*
Vlp = primary line current
Vpp = primary phase voltage
Tp =primary turns per phase
Vc = Voltage per coil
Nc = Number of coil
Vc1 = Modified voltage per coil
Ncn = number of normal coils
Nct = turns in the normal coils
Tp1 = Modified turn after considering tapping
Tp2 = total  customer turn
tp = percentage tapping
tc = turns per coil
Ncl = Number of layers
Tncl = Turns per layer
Ipp = primary phase current
ap = Area of the primary conductor
ap1 =Modified area of the primary conductor
dp = calculated diameter
dp1 = standard diameter of calculated diameter
dp2 = Insulated diameter of the primary conductor
Hlp = Axial depth of the coil
dbc = separation b/w adjacent coil
Lcp = Axial length of the HV Winding
clc = clearance
ti = thickness of insulation between b/w the layers
bp = Radial depth of the hv coil
T = thickness of the insulation b/w HV and LV
IDhv = Inside diameter of the HV winding
ODhv = Outside diameter of the HV winding
*/

float Lmtp,Lmts;
float Dpm,Dsm,Rp,Rs,Ref,ep,rop,ros;
float Dm,Lmt,Lc,Xp,epx,epi;
float Li2r,Ls,Pi2r,Nl,Ny,Wl,Lcl,Wy,Lyl,Pi;
float Pc,Lt,eff;
float atc,aty,Mmmf,ATo,Im,Il,Io,Per;


void cd()
{

   // clrscr();
    FILE *fp;
    fp = fopen("CD.txt","w");
    printf("\t\t\tCORE DESIGN\n");
    fprintf(fp,"\n******************************************************************\n");
    fprintf(fp,"\t\tCORE DESIGN OF THE TRANSFORMER\n");
    fprintf(fp,"******************************************************************\n\n\n\n\n");
    printf("Enter the kVA rating of the transformer(KVA):");
    scanf("%f",&KVA);
    fprintf(fp,"kVA rating of the transformer is %0.2f kVA",KVA);
    printf("\nFor distribution transformer K = 0.45,\nFor power transformer K = 0.6 to 0.7\n");
    printf("\nEnter the value of K: ");
    scanf("%f",&K);
    fprintf(fp,"\nValue of K is %0.2f",K);
    Et = K*sqrt(KVA);
    fprintf(fp,"\nVoltage per Turn is %0.2f V",Et);
    printf("\nEnter the value of line frequency(Hz):");
    scanf("%f",&f);
    fprintf(fp,"\nLine frequency is %0.0f Hz",f);
    printf("\nEnter the number of phases:");
    scanf("%f",&m);
    fprintf(fp,"\nNumber of phase of the transformer is %0.2f",m);
    PHlm = Et/(4.44*f);
    fprintf(fp,"\nFlux in the core is %0.6f Wb",PHlm);
    printf("\nDistribution Transformer Bm = 1 to 1.4 Wb/m^2.");
    printf("\nPower Transformer Bm = 1.25 to 1.45 Wb/m^2.\n\n");
    printf("Enter the value of Flux density(Wb/m^2): ");
    scanf("%f",&Bm);
    fprintf(fp,"\nFlux density is %0.4f Wb/m^2\n",Bm);
    Ai = PHlm/Bm;
    fprintf(fp,"\nNet iron area is %0.6f m^2",Ai);
    printf("\nEnter the value of stacking factor   (Normally taken as 0.9):  ");
    scanf("%f",&Ki);
    fprintf(fp,"\nStacking factor is %0.2f",Ki);
    Agi = Ai/Ki;
    fprintf(fp,"\nGross Iron area is %0.6f m^2",Agi);
    printf("\nEnter the type of Core:\n1-Square\n2-Cruciform\n3-Stepped\n4-Stepped\n");
    scanf("%d",&i);

    switch(i)
    {
    case 1:
        fprintf(fp,"\nType of the core is Square");
        ct = 0.45;
        d = sqrt(Ai/ct);
        fprintf(fp,"\nDiameter of the core is %0.4f m",d);
        p = sqrt(0.5)*d;
        printf("\nDimension is %f",p);
        fprintf(fp,"\nDimension is %0.3f",p);
        break;

    case 2:
        fprintf(fp,"\nType of the core is Cruciform");
        ct = 0.56;
        d = sqrt(Ai/ct);
        fprintf(fp,"\nDiameter of the core is %0.4f m",d);
        p = 0.85*d;
        q = 0.53*d;
        printf("\nDimension is %f * %f",p,q);
        printf("\nEnter the dimensions of the laminations : (a * b) \n");
        scanf("%f %f",&p,&q);
        fprintf(fp,"\nDimension is %0.3f * %0.3f",p,q);
        break;

    case 3:
        fprintf(fp,"\nType of the core is 3 Stepped");
        ct = 0.6;
        d = sqrt(Ai/ct);
        fprintf(fp,"\nDiameter of the core is %0.4f m",d);
        r = 0.42*d;
        q = 0.7*d;
        p = 0.9*d;
        printf("\nDimension is %f*%f*%f",p,q,r);
        fprintf(fp,"\nDimension is %0.3f*%0.3f*%0.3f",p,q,r);
        break;

    case 4:
        fprintf(fp,"\nType of the core is 4 Stepped");
        ct = 0.62;
        d = sqrt(Ai/ct);
        fprintf(fp,"\nDiameter of the core is %0.4f m",d);
        p = 0.36*d;
        q = 0.36*d;
        r = 0.78*d;
        s = 0.92*d;
        printf("\nDimension is %f*%f*%f%f\n",p,q,r,s);
        fprintf(fp,"\nDimension is %0.3f*%0.3f*%0.3f*%0.3f",p,q,f,s);
        break;

    }
    fclose(fp);
   // clrscr();
}
//Window Dimension of the transformer
void wd()
{
//	clrscr();
	FILE  *fp;
	fp = fopen("WD.txt","w");
	printf("\n\n\t\t\tWINDOW DIMENSION \n");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tWINDOW DIMENSION OF THE TRANSFORMER\n");
	fprintf(fp,"\n******************************************************************\n\n\n");
	printf("\nEnter the primary winding voltage(in KV): ");
	scanf ("%f", & KV);
	fprintf(fp,"\nPrimary Winding Voltage is %0.0f KV", KV);
	if(KVA >= 1 && KVA < 50)
		Kw = 8/(30 +KV);
	if(KVA >= 50 && KVA <200)
		Kw = 10/(30 + KV) ; //Window space factor
	if(KVA >= 200 )
		Kw = 12/(30 + KV);
	fprintf(fp,"\nWindow Space factor is %0.3f", Kw);
	printf ("\nThe calculated window space factor is %f. \n\nEnter the modified Windows space factor: ", Kw);
	scanf( "%f", & Kw);
	fprintf(fp,"\nModified Window Space factor is %0.3f", Kw);
	fprintf(fp,"\nFlux Density is %0.4f Wb", Bm);
	printf("\nEnter the Current Density(A/mm^2):");
	scanf("%f", &delta);
	fprintf(fp,"\nCurrent Density is %0.2f A/mm^2", delta);
	Aw = (KVA*1000)/(3.33*f*Bm*Kw*delta*Ai*1000000) ; //Window area
	fprintf(fp,"\nArea of the window is %0.6f m^2", Aw);
	printf(" \nEnter the ratio height to width of the window(Range 2 to 4):");
	scanf("%f", &ratio1);
	fprintf(fp,"\nRatio-Height to Width of the window is %0.1f",ratio1);
	Ww = sqrt (Aw/ratio1) ; //Width of the window
	fprintf(fp,"\nWidth of the Window is %0.3f m", Ww);
	Hw=ratio1*Ww; //Height of the window
	fprintf(fp,"\nHeight of the Window is %0.3f m", Hw);
	printf("\nThe calculated height and width of the window are %f and %f. \n\n Enter the modified height and width of the window (m) :", Hw, Ww);
	scanf("%f%f", &Hw, &Ww);
	fprintf(fp,"\nModified height of the window = %0.3f m \n Modified width of the Window = %0.3f m", Hw, Ww);
	D = Ww + d; //Distance b/w adjacent core centers
	fprintf(fp,"\nDistance between adjacent core is %0.3f m", D);
	fclose(fp);
}

//YOKE DESIGN OF THE TRANSFORMER

void yd()
{
//	clrscr();
	printf("\n\n\t\tYOKE DESIGN \n");
	FILE  *fp;
	fp = fopen("YD.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tYOKE DIMENSION OF THE TRANSFORMER\n");
	fprintf(fp,"\n******************************************************************\n\n\n");
	printf("\nArea of the yoke is 5 to 25 percent larger than the core (%f m^2) of the transformer.\n",Ai);
	printf("\nEnter the ratio-area of yoke to limbs :");
	scanf("%f", &ratio1);
	fprintf(fp,"The ratio-area of yoke to limbs %0.2f",ratio1);
	FDy = Bm/ratio1 ; //Flux Density in the YOKE
	fprintf(fp,"\nFlux Density in the Yoke %0.6f Wb/m^2",FDy);
	Ay = ratio1*Ai; //Area of the YOKE
	fprintf(fp,"\nArea of the Yoke is %0.6f m^2", Ay);
	Agy = Ay/Ki ; //Gross area of the YOKE
	fprintf(fp,"\nGross area of the Yoke is %0.6f m^02", Agy);
	printf("\nThe section of the yoke is taken as Rectangular. \n");
	//printf("\nTake the Depth of the Yoke as highest side of the laminated core. \n");
	//fprintf(fp,"\nselected the section of the yoke is Rectangular. Taking the Depth");
	//fprintf(fp,"\nof the Yoke as highest side of the laminated core. \n");
	//printf("\n Dimension of the laminated core is : %0.3f * %0.3f * %0.3f * %0.3f (in m) \n", p,q,r,s);
	Dy=p;//Depth of the Yoke
	if(type==2)
		Hy =p;	//Height of the Yoke
	else
		Hy = Agy/Dy;
	//printf("\n Enter the value of depth of the yoke (m) :");
	//scanf ("%f", &Dy);
	printf("\nDepth of the yoke is : %0.3f m \n Height of the yoke is : %0.3f m \n\nEnter the modifed depth and height of the yoke : ",Dy,Hy);
	scanf("%f %f",&Dy,&Hy);
	fprintf(fp,"\nDepth of the Yoke is %0.3f m", Dy);
	fprintf(fp,"\nHeight of the Yoke is %0.3f m", Hy);
	fclose(fp);
}


//OVERALL DIMENSION OF THE TRANSFORMER
void od()
{
//	clrscr();
	printf("\n\n\t\tOVERALL DIMENSION \n");
	FILE *fp;
	fp = fopen("OD.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tOVERALL DIMENSION OF THE TRANSFORMER\n");
	fprintf(fp,"\n******************************************************************\n\n\n");
	D = d + Ww;//distance b/w adjacent core centers
	fprintf(fp,"Distance between adjacent core centers is %0.3f m", D);
	printf("\nDistance between adjacent core centers is %0.3f m", D);
	H = Hw + 2*Hy ; //Helght of the Frame
	fprintf(fp,"\nHeight of the frame is %0.3f m", H);
	printf("\nHeight of the frame is %0.3f m", H);
	W = 2*D + p ;//width of the frame
	fprintf(fp,"\nWidth of the Frame is %0.3f m", W);
	printf("\nWidth of the Frame is %0.3f m", W);
	Df=p; //Depth of the frame
	fprintf(fp,"\nDepth of the Frame is %0.3f m", Df);
	printf("\nDepth of the Frame is %0.3f m", Df);
	fclose(fp);
}

//LOW VOLTAGE WINDING CALCULATION OF THE TRANSFORMER

void lvw()
{
//	clrscr( );
	printf("\n\n\t\t\tLOW VOLTAGE WINDING DESIGN\n");
	FILE *fp;
	fp = fopen("LVD.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tLOW VOLTAGE WINDING CALCULATION OF THE TRANSFORMER\n");
	fprintf(fp,"\n******************************************************************\n\n\n");
	printf("Enter the secondary line voltage (V) :");
	scanf("%f", &Vls);
	fprintf(fp,"Secondary Line Voltage is %0.2f V", Vls);
	check:
	printf("\n Enter the Connection type : \nl-Star \n2-Delta \n");
	scanf("%d", &c1);
	switch(c1)
	{
		case 1:
				fprintf(fp,"\nConnection Type is Star");
			Vsp = Vls/sqrt(3);
			fprintf(fp,"\nPhase Voltage is %0.3f V", Vsp);
			break;
		case 2:	//Phase Voltage
				 fprintf(fp,"\nConnection Type is Delta");
			Vsp = Vls;
				fprintf(fp,"\nPhase Voltage is %0.3f V", Vsp);
			break;
		default: goto check;
	}
	Ts = (Vsp/Et) ; //Turn per phase
	printf("\nCalculated turns per phase : %0.2f . \nEnter the turns per phase : ",Ts);
	scanf("%f",&Ts);
	fprintf(fp, "\nTurn per Phase is %0.2f", Ts);
	Isp = (KVA*1000)/(3 *Vsp) ; //secondarv phase current
	fprintf(fp,"\nSecondary Current per phase is %0.3f A", Isp);
	printf("\nDistribution Transformer current density- 1.1 to 2.5 A/mm^2.\n");
	printf("\nPower transformer-\n\t (i) Self oil cooled type or alr blast \n\n\t current density-2.2 to 3.2 A/mm^2. \n");
	printf("\n\t(ii) Forced circulation of oil or with water cooling coil \n\n\t current density- 5.4 to 6.2 A/mm^2.\n");
	printf("\nEnter Current Density(A/mm^2):");
	scanf("%f", &delta);
	fprintf(fp,"\nCurrent Density in Secondary phase is %0.2f A/mm^2", delta);
	as = Isp/delta ; //Area of the Secondary Conductor
	fprintf(fp,"\nTotal Area of Secondary Conductor is %0.3f mm^2", as);
	printf("\nTotal Area of Secondary Conductor is %f mm^2 \n", as);
	/*printf("\nEnter the number of strips:");
	scanf("%f", &st);
	printf("\nArea of each conductor is %0.3f mm^2. \n",(as/st));
	fprintf(fp,"\nTo provide %0.f mm^2 area, the number of conductor is %0.0f", as, st);*/
	conductor:
	printf("\nUse the proper conductor(23.1//IS:1897-1962//) and Enter the dimension(mm):");
	scanf("%f%f", &x, &y);
	fprintf(fp,"\n Dimension of the Conductor is %0.3f * %0.3f",x,y);
	as1 = /*st**/x*y ; //modified area of the conductor
	fprintf(fp,"\nModified area of Secondary Conductor is %0.3f mm^2", as1);
	delta1 = Isp/as1 ; //modified current density in the conductor
	fprintf(fp,"\nModified Current Density in Secondary phase is %0.2f A/mm^2", delta1);
	printf("\n Enter the proper value covering (mm): ");
	scanf("%f", &z);
	fprintf(fp,"\nCovering of Conductor is %0.3f mm", z);
	X1 = x + z;
	Y1 = y + z ; //dimension with covering
	fprintf(fp,"\n Dimension of the conductor with covering is %0.3f * %0.3f",X1,Y1);
	printf("\nThe Turn per phase is %0.2f. \n", Ts);
	printf("\nEnter the number of layers to be used :");
	scanf("%d", &lay);
	fprintf(fp,"\nNumber of layer is used is %d", lay);
	Ts1 = (Ts/lay) + 1 ; //Turns along the axial depth
	printf("\nCalculated turns along the axial depth = %0.2f . \n Enter the turns along the axial depth : ",Ts1); 
	scanf("%f",&Ts1);
	printf("\nUsing helical winding space to be provided %0.2f turns along the axis. \n", Ts1);
	fprintf(fp,"\nUsing helical winding space to be provided %0.2f turns along the axis", Ts1);
	fprintf(fp,"\nTurns along the axial depth is %0.2f", Ts1);
	Lcs = Ts1 *X1 ;// axial depth of the lv winding
	printf("\nAxial depth of LV winding is %0.3f mm \n", Lcs);
	fprintf(fp,"\nAxial depth of the Winding ls %0.3f mm", Lcs);
	cls = ((Hw * 1000)-Lcs)/2 ; //clearance
	fprintf(fp,"\nClearance is %0.3f mm", cls);
	if(cls < 15)
	{
		printf("\nThe calculation does not satisfy (15) minimum clearance. Recalculate.");
		fprintf(fp,"\nThe calculation does not satisfy (15) minimum clearance. Recalculate.");
		goto conductor;
	}
	printf("\n Enter the thickness of the pressboard cylinders (mm) : ");
	scanf("%f",&cly);
	fprintf(fp,"\n Thickness of the pressboard cylinders is %0.3f mm", cly);
	bs = lay * Y1 + 2 * cly; //radial depth of the lv winding
	/*printf("\n Enter the Insulation for the circumscribing circle(0.5mm)");
	scanf("%f",&di);
	fprintf(fp,"\nlnsulation for the circumscribing circle is %0.3f mm", di); */
	printf("\n Enter the Insulation b/w lv winding and core(1.5mm) : ");
	scanf("%f",&lvi);
	fprintf(fp,"\nlnsulations b/w lv winding and core is %0.3f mm", lvi);
	//dc=d+(di/1000); //diameter of the circumscribing circle
	fprintf(fp,"\n Diameter of the circumscribing circle is %0.3f mm", d);
	Id=d*1000 + 2 * lvi ; //Inside diameter
	fprintf(fp,"\n Inside diameter is %0.3f mm", Id);
	Od=Id + 2 * bs ; //Outside diameter
	fprintf(fp,"\nOutside diameter is %0.3f mm", Od);
	fclose(fp);
}

void hvw()
{

//	clrscr();
	printf("\n\n\t\t\t HIGH VOLTAGE WINDING DESIGN\n");
	FILE *fp;
	fp = fopen("HVD.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tHIGH VOLTAGE WINDING DESIGN OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	printf("Enter the primary line voltage(V): ");
	scanf("%f",&Vlp);
	fprintf(fp,"The primary line voltage is %0.2f V",Vlp);
	connection:
	printf("\nEnter the connection Type :\n1-star\n2-Delta\n ");
	scanf("%d",&c);
	if(c==1||c==2)
	{
		switch(c)
		{
			case 1:
				fprintf(fp,"\nConnection Type is star");
				Vpp=Vlp/sqrt(3);
				fprintf(fp,"\nPrimary phase voltage is %0.3f V",Vpp);
				break;
			case 2:
				fprintf(fp,"\nConnection type is delta");
				Vpp=Vlp;
				fprintf(fp,"\nPrimary phase voltage is %0.3f V",Vpp);
				break;
		}
	}
	else
		goto connection ;
	Tp=(Ts*Vpp)/Vsp;
	fprintf(fp,"\nPrimary turn per phase is %d ",Tp);
	tapping:
	printf("\nPress 1 - for NO Tapping\nPress 2 - for Tapping\n");
	int t;
	scanf("%d",&t);
	if(t==2)
		{
			fprintf(fp,"\nTapping is considered here");
			printf("\nEnter the Percentage of Tapping : ");
			scanf("%f",&tp);
			fprintf(fp,"\nPercentage of Tapping is %0.3f ",tp);
			Tp1=((tp/100)+1)*Tp;
			fprintf(fp,"\nPrimary Turns per Phase with %0.3f tapping is  %0.0f",tp,Tp1);
		}
	else if(t==1)
		{
			fprintf(fp,"\nThere is no Tapping");
			Tp1=Tp;
		}
	else
		{
			t=0;
			goto tapping;
		}
	NOC:
	printf("\nActual number of Turns per phase is %0.0f.\n",Tp1);
	fprintf(fp,"\nCrossover winding is used here.\n");
	printf("\nThe Crossover winding is used here.\n\nEnter the voltage per coil:");
	scanf("%f",&Vc);
	fprintf(fp,"\nThe value of voltage per coil is %0.3f V",Vc);
	Nc=Vlp/Vc;
	fprintf(fp,"\nNumber of coil is %d",Nc);
	cal:
	printf("\nThe calculated number of coil is %d.\n\nEnter the number of coils :",Nc);
	scanf("%d",&Nc);
	fprintf(fp,"\nModified number of coils is %d",Nc);
	Vc1=Vpp/Nc;
	fprintf(fp,"\nModified value of voltage per coil is %0.3f V",Vc1);
	tc=Tp1/Nc;
	fprintf(fp,"\nTurns per coil is %f",tc);
	printf("\nTotal number of coil is %d.\n",Nc);
	printf("\nEnter the number of normal coil :");
	scanf("%f",&Ncn);
	fprintf(fp,"\nNumber of normal coil is %0.0f",Ncn);
	printf("\nEnter turns for the normal coil : ");
	scanf("%f",&Nct);
	fprintf(fp,"\nTurns in the normal coil is %0.0f",Nct);
	fprintf(fp,"\nReinforced turns in remaining %0.0f coil is %0.0f",(Nc-Ncn),(Tp1-(Ncn*Nct)));
	Tp2=(Ncn*Nct)+((Nc-Ncn)*(Tp1-(Ncn*Nct)));
	printf("\nTotal Turn is %0.0f.\n\nEnter the numbers of layers :\n",Tp1);
	scanf("%f",&Ncl);
	fprintf(fp,"\nNumber of layers is %0.0f ", Ncl);
	Tncl=tc/Ncl;
	printf("\nTurns per layer is %0.0f \nEnter the turns per layer : ",Tncl);
	scanf("%f",&Tncl);
	fprintf(fp,"\nTurns per layer is %0.0f",Tncl);
	/*if(2*Ncl*Et>300)
	{
		printf("\nWarning......\nFurther calculation may cause some error.");
		printf("\nThe value of 2*Ncl*Et exceeds 300.It is %0.0f",(2*Ncl*Et));
		printf("\nChange the value of voltage per coil of turns per coil.");
		fprintf(fp,"\nWarning........\nFurther calculation may cause some error.");
		fprintf(fp,"\nThe value of 2*Ncl*Et exceeds 300 . It is %0.0f",(2*Ncl*Et));
		fprintf(fp,"\nChange the value of voltage per coil or turns per coil.");
		goto NOC;
	}*/
	Ipp=(KVA*1000)/(3*Vpp);
	fprintf(fp,"\nPrimary current per phase is %0.3f A",Ipp);
	printf("\nPrimary current per phase is %0.3f A",Ipp);
	if(Ipp<=20)
	{
		printf("\nCurrent is below 20A. Cross over winding is used here.\n");
 		fprintf(fp,"\nCurrent is below 20A. Cross over winding is used here.");
	}
	printf("\nEnter the current density in primary conductor(A/mm^2).");
	scanf("%f",&delta);
	fprintf(fp,"\nCurrent density in the primary conductor is %0.3f A/mm^2",delta);
	ap=Ipp/delta;
	printf("\nEnter the type of conductor : \n 1. Round conductor\n 2. Rectangular conductor\n ");
	scanf("%f",&con);
	if(con==1)
	{
		fprintf(fp,"\n Area of the primary conductor is %0.3f mm^2",ap);
		dp=sqrt((4*ap)/pi);
		fprintf(fp,"\nDiameter of the primary conductor is %0.3f mm",dp);
		printf("\nCalculated value of the diameter of the primary conductor is %0.3f mm .\n",dp);
		printf("\nEnter the nearest standard value of the diameter(in mm).  (Ref Table 23.7)\n");
		scanf("%f",&dp1);
		fprintf(fp,"\nStandard value of the diameter(Ref Table 23.7)is %0.3f mm",dp1);
		printf("\nEnter the nearest standard value of the diameter with proper insulation(in mm).   (Ref Table 23.7)\n");
		scanf("%f",&dp2);
		fprintf(fp,"\nStandard value of the diameter proper insulation is %0.3f mm",dp2);
		ap1=((pi*dp1*dp1)/4);
		fprintf(fp,"\nModified area of the primary conductor is %0.3f mm^2",ap1);
		printf("\nModified area of the primary conductor is %0.3f mm^2",ap1);
	}
	if(con==2)
	{
		printf("\nArea of the primary conductor is %0.3f mm\n",ap);
		fprintf(fp,"\nArea of primary conductor is %0.3f mm mm^2\n",ap);
		scanf("%f",&stp);
		fprintf(fp,"\nNumber of strip is %0.0f",stp);
		printf("\nEnter the dimension of the conductor (ref Table 23.1)in mm:");
		scanf("%f%f",&dp1,&dp2);
		fprintf(fp,"\nThe dimension of the conductor (ref. Table 23.1) in mm is %0.3f * %0.3f",dp1,dp2);
		printf ("\nEnter the number coil in axial:");
		scanf("%f",&ca);
		fprintf(fp,"\nNumber of coil in axial is %0.0f",ca);
		printf("\nEnter the number of coil in radial:");
		scanf("%f",&cr);
		fprintf(fp,"\nNumber of coil in radial is %0.3f",cr);
		printf("\nEnter the proper value of insulation(in mm):");
		scanf("%f",&dp3);
		fprintf(fp,"\nDimension of the insulated conductor is %0.3f %0.3f in mm",(dp1+dp3),(dp2+dp3));
		ap1=stp*(dp1+dp3)*(dp2+dp3);
		fprintf(fp,"\nModified area of the conductor is %0.3f mm^2",ap1);
	}
	delta1=(Ipp/ap1);
	fprintf(fp,"\nModified current density in the primary conductor is %0.3f A/mm^2",delta1);
	/*if(con==2)
		Hlp=ca*dp2;*/
	Hlp=Tncl*dp2;
	fprintf(fp,"\nAxial depth of coil is %0.3f",Hlp);
	printf("\nAxial depth of one coil = %0.3f\n",Hlp);
	printf("\n Enter the height of spacers between adjacent coils(in mm) : ");
	scanf("%f",&dbc);
	fprintf(fp,"\nSpacers between adjacent coils are given of %0.1f mm",dbc);
	Lcp=(Nc*Hlp)+(Nc*dbc);
	fprintf(fp,"\nAxial length of the hv winding is %0.3f mm\n",Lcp);
	printf("\nAxial length of hv winding : %0.3f\n",Lcp);
	clc=((Hw*1000)-Lcp)/2;
	fprintf(fp,"\nClearance is %0.3f mm",clc);
	if(clc<5)
	{
		fprintf(fp,"\nClearance is only %0.3f, which is very small. Recalculate !\n",clc);
		goto cal;
	}
	printf("\nEnter the thickness of insulation between the layers(in mm): ");
	scanf("%f",&ti);
	fprintf(fp,"\nThickness of the insulation between the layers is %0.3f mm",ti);
	if(con==2)
		bp=cr*dp2;
	bp=(Ncl*dp2)+(Ncl-1)*ti;
	fprintf(fp,"\nRadial depth of the coil is %0.3f mm",bp);
	T=(5+(0.9*Vlp)/1000);
	fprintf(fp,"\nThickness of the insulation b/w LV and HV is %0.3f mm",T);
	IDhv=Od+2*T;
	fprintf(fp,"\nInside diameter of the HV is %0.3f mm",IDhv);
	ODhv=IDhv+2*bp;
	fprintf(fp,"\nOutside diameter of HV is %0.3f mm",ODhv);
	printf("\nIndide diameter of hv winding : %0.3f \n Outside diameter of hv winding : %0.3f \n",IDhv,ODhv);
	fclose(fp);
}

void resis()
{
	//clrscr();
	printf("\n\n\t\tRESISTANCE CALCULATION\n");
	FILE *fp;
	fp=fopen("RESIS.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tRESISTANCE DESIGN OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	Dpm=(IDhv + ODhv)/2;
	fprintf(fp,"Mean diameter of the HV winding is %0.3f mm",Dpm);
	Lmtp=(pi*Dpm)/1000;    //Length of mean turn in HV winding
	fprintf(fp,"\nLength of mean turn in HV winding is %0.3f",Lmtp);
	printf("\nEnter the Resistivity of the material of high voltage winding (0.021 - default ) : ");
	scanf("%f",&rop);
	fprintf(fp,"\nResistivity of the material is %0.4f",rop );
	Rp=(Tp*Lmtp*rop)/ap1;  //Resistance in the HV side
	fprintf(fp,"\nResistance in the HV side is %0.4f",Rp);
	Dsm=(Id + Od)/2;   //Mean diameter of the LV winding
	fprintf(fp,"\nMean diameter of the LV winding is %0.3f mm",Dsm);
	Lmts=(pi*Dsm)/1000;    //Length of mean turn in LV winding
	fprintf(fp,"\nLength of mean turn in LV winding is %0.3f",Lmts);
	printf("\nEnter the Resistivity of the material of low voltage winding (0.021 - default ) : ");
	scanf("%f",&ros);
	fprintf(fp,"\nResistivity of the material is %0.4f",ros);
	Rs=(Ts*Lmts*ros)/as1;  //Resistance in the LV side
	fprintf(fp,"\nResistance in the LV side is %0.4f",Rs);
	Ref= Rp + (((Tp*Tp)/(Ts*Ts))*Rs);    //Resistance reffered to primary side
	fprintf(fp,"\nResistance reffered to primary side is %0.4f Ohm",Ref);
	ep= (Ipp*Ref)/Vlp;    //Per Unit Resistance
	fprintf(fp,"\nPer Unit Resistance is %0.4f",ep);
	printf("\nPer Unit Resistance = %0.4f\n",ep);
	fclose(fp);
}



void lr()
{
//	clrscr();
	printf("\n\n\t\t\tLEAKAGE REACTANCE\n");
	FILE *fp;
	fp=fopen("LEAKAGE.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tCALCULATION OF LEAKAGE REACTANCE OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	Dm= (Id + ODhv)/2;   //Mean diameter of winding
	fprintf(fp,"Mean diameter of winding is %0.3f mm ",Dm);
	Lmt=(pi*Dm)/1000;     //Length of mean turn of winding
	fprintf(fp,"\nLength of mean turn of winding is %0.3f m",Lmt);
	Lc=(Lcp+Lcs)/2;       //Mean Axial Length of the winding
	fprintf(fp,"\nMean Axial Length of the winding is %0.3f mm",Lc);
	Xp=(2*pi*f*muo*Tp*Tp*Lmt*(T+(bp+bs)/3))/Lc;    //Leakage reactance reffered to primary side
	fprintf(fp,"\nLeakage reactance reffered to primary side is %0.3f Ohm",Xp);
	epx=(Ipp*Xp)/Vpp;     //Per Unit leakage reactance
	fprintf(fp,"\nPer Unit leakage reactance is %0.3f ",epx);
	printf("\nPer Unit Reactance = %0.4f\n",epx);
	epi=sqrt((ep*ep)+(epx*epx));       //Per Unit Impedance
	fprintf(fp,"\nPer Unit Impedance is %0.3f",epi);
	fclose(fp);
}





float rg;  // variable to store the regulation of the transformer
void reg()
{
	FILE *fp;
	fp=fopen("REGULATION.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tCALCULATION OF REGULATION OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	rg=ep*0.8+epx*0.6;
	fprintf(fp,"\nRegulation of the Transformer is %0.2f% .\n",rg*100);
	printf("\nRegulation : %0.2f\n",rg*100);
	fclose(fp);
}




void cl()
{
//	clrscr();
	printf("\n\n\t\t LOSS CALCULATION\n");
	FILE *fp;
	fp=fopen("LOSSES.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tCALCULATION OF LOSSES OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	fprintf(fp, "\nI^2R Loss\n");
	Li2r=3*Ipp*Ipp*Ref;     //I^2R Loss
	fprintf(fp,"I^2R Loss is %0.3f W\n",Li2r);
	//printf("\nCopper loss is %0.3f W\n",Li2r);
	printf("\nEnter the percentage Stray Loss (5 to 25 percent of copper loss) : ");
	scanf("%f",&Ls);
	fprintf(fp,"\nPercentage Stray Loss is %0.3f",Ls);
	Pi2r=(1+Ls/100)*Li2r;             //I^2R Loss including Stray Loss
	fprintf(fp,"\nI^R Loss including Stray Loss is %0.3f W",Pi2r);
	printf("\nTotal Copper loss including stray load loss is %0.3f W\n",Pi2r);
	fprintf(fp, "\nCORE Loss\n");
	printf("\nEnter the Density of Lamination (7.6e3 Kg/m^2) : ");
	scanf("%f",&y);
	fprintf(fp,"\nDensity of Lamination is %0.3f Kg/m^2",y);
	printf("\nEnter the Number of Limbs : ");
	scanf("%f",&Nl);
	Wl=Nl*Hw*Ai*y;      //Weight of total limbs
	fprintf(fp,"\nWeight of the Limbs is %0.3f Kg",Wl);
	printf("\nEnter specific core loss (W/kg) according to FLux density in the limbs (%0.3f Wm/m^2) : ",Bm);
	scanf("%f",&z);
	fprintf(fp,"\nSpecific Core Loss is %0.3f W/kg",z);
	Lcl=Wl*z;                         //Core Loss in the Limbs
	fprintf(fp,"\nCore Loss in the Limbs is %0.3f W",Lcl);
	printf("\nEnter the Number of Yokes : ");
	scanf("%f",&Ny);
	printf("\nEnter the Density of Lamination (7.6e3 Kg/m^2) : ");
	scanf("%f",&y);
	fprintf(fp,"\nDensity of Lamination is %0.3f Kg/m^2",y);
	Wy=Ny*W*Ay*y;      //Weight of total yokes
	fprintf(fp,"\nWeight of the Yokes is %0.3f Kg",Wy);
	printf("\nEnter specific core loss (W/kg) according to FLux density in the yoke (%0.3f Wm/m^2) : ",FDy);
	scanf("%f",&z);
	fprintf(fp,"\nSpecific Core Loss is %0.3f W/kg",z);
	Lyl=Wy*z;                         //Core Loss in the yoke
	fprintf(fp,"\nCore Loss in the Yoke is %0.3f W",Lyl);
	Pi=Lcl+Lyl;                       //Total Core Loss
	fprintf(fp,"\nTotal Core Loss is %0.3f W",Pi);
	printf("\nTotal Core loss is %0.3f W\n",Pi);
	fclose(fp);
}


void effi()
{
//	clrscr();
	printf("\n\n\t\t EFFICIENCY\n");
	FILE *fp;
	fp=fopen("EFFICIENCY.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tCALCULATION OF EFFECIENCY OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	Lt=Pi+Pi2r;    //Total Loss
	fprintf(fp,"\nTotal Loss is %0.3f W\n",Lt);
	eff = (KVA*1000/((KVA*1000)+Lt))*100;         //Efficiency of the transformer
	fprintf(fp,"\nEfficiency of the transformer is %0.2f\n",eff);
	printf("\nEfficiency of the transformer is %0.2f\n",eff);
	x=sqrt(Pi/Pi2r);                  //Condition for maximum effciency
	fprintf(fp,"\nCondition for Maximum Efficiency is %0.3f\n",x);
	printf("\nCondition for Maximum Efficiency is %0.3f\n",x);
	fclose(fp);
}



void nlc()
{
//	clrscr();
	printf("\n\n\t\t NO LOAD CURRENT\n");
	FILE *fp;
	fp=fopen("NLC.txt","w");
	fprintf(fp,"\n******************************************************************\n");
	fprintf(fp,"\t\tNO LOAD CURRENT CALCULATION OF THE TRANSFORMER\n");
	fprintf(fp,"******************************************************************\n\n\n");
	printf("\nEnter the value 'at' of core corresponding to the flux density (%0.3f Wb/m^2) in core (A/m) : ",Bm);
	scanf("%f",&atc);
	fprintf(fp,"\nValue 'at' of core corresponding to the flux density in core is %0.2f A/m",atc);
	printf("\nEnter the value 'at' of yoke corresponding to the flux density (%0.3f Wb/m^2) in core (A/m) : ",FDy);
	scanf("%f",&aty);
	fprintf(fp,"\nValue 'at' of yoke corresponding to the flux density in yoke is %0.2f A/m",aty);
	Mmmf=Nl*Hw*atc+Ny*W*aty;               //Total Magnetizing mmf
	fprintf(fp,"\nTotal Magnetizing current is %0.3f A",Mmmf);
	ATo=Mmmf/m;                            //Magnetizing mmf per phase
	fprintf(fp,"\nMagnetizing mmf per Phase is %0.3f A",ATo);
	Im=ATo/(sqrt(2)*Tp);                  //Magnetizing current
	fprintf(fp,"\nMagnetizing Current is %0.5f A",Im);
	Il=Pi/(Vpp*m);                           //Loss Component of the NLC current
	fprintf(fp,"\nLoss Component of the No Load Current is %0.5f A",Il);
	Io=sqrt((Im*Im)+(Il*Il));                     //No Load Current
	fprintf(fp,"\nNo Load Current is %0.5f A\n",Io);
	Per=(Io/Ipp)*100;           //NLC as a percentage of FL
	fprintf(fp,"\nNo Load Current as a percentage of Full Load Current is %0.1f\n",Per);
	printf("\nNo Load Current as a percentage of Full Load Current is %0.1f\n",Per);
	if(Per>5)
	{
		printf("\nNo Load Current exceeds the limit value (5%). It is %0.3f",Io);
		fprintf(fp,"\nNo Load Current exceeds the limit value (5%). It is %0.3f",Io);
	}
	fclose(fp);
}

int main()
{
	printf("\n\t\tTRANSFORMER DESIGN\n\n");
		printf("\nEnter the type of tramsformer: 1. Distribution 2. Power\n");
		scanf("%d",&type);
	cd();
	wd();
	yd();
	od();
	lvw();
	hvw();
	resis();
	lr();
	reg();
	cl();
	effi();
	if(type==1)
		nlc();
	return 0;
}

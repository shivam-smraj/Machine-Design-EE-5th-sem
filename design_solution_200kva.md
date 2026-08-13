# Complete Transformer Design Solution & CAD Report

**Reference Specification**: A.K. Sawhney's *A Course in Electrical Machine Design*  
**Software Verification**: [`machine.c`](file:///c:/Users/Shivam/Desktop/Machine_Design/machine.c) (Compiled & Executed)

---

## 1. Problem Statement & Design Requirements

Design a **3-Phase, 200 kVA, 33 kV / 433 V, 50 Hz, Core-Type Distribution / Power Transformer** with tappings of $\pm 2.5\%, \pm 5\%$ on the High Voltage (HV) winding.

### 1.1 Specified Design Parameters

| Parameter | Symbol | Value / Specification |
| :--- | :--- | :--- |
| **Rated Output** | $Q$ / $\text{kVA}$ | $200\text{ kVA}$ |
| **Primary Voltage (HV)** | $V_{lp}$ | $33\text{ kV} = 33,000\text{ V}$ (Delta Connected) |
| **Secondary Voltage (LV)** | $V_{ls}$ | $433\text{ V}$ (Star Connected) |
| **Frequency** | $f$ | $50\text{ Hz}$ |
| **Number of Phases** | $m$ | $3$ |
| **Transformer Type** | — | Core Type, Oil Immersed Natural Cooled |
| **Voltage per Turn Constant** | $K$ | $0.45$ ($E_t = K\sqrt{\text{kVA}}$) |
| **Maximum Core Flux Density** | $B_m$ | $1.0\text{ Wb/m}^2$ |
| **Stacking Factor** | $K_i$ | $0.90$ |
| **Core Stepping Profile** | — | Cruciform Core ($A_i = 0.56 d^2$) |
| **Current Density** | $\delta$ | $2.3\text{ A/mm}^2$ |
| **Window Space Factor** | $K_w$ | $\frac{10}{30 + KV} = \frac{10}{30 + 33} = 0.1587 \approx 0.160$ |
| **HV Winding Tappings** | — | $\pm 2.5\%, \pm 5.0\%$ on HV winding |
| **Stray Load Loss** | $L_s$ | $10\%$ of Copper Loss |
| **Lamination Density** | $\gamma$ | $7,600\text{ kg/m}^3$ |
| **Specific Core Loss** | $z$ | $1.5\text{ W/kg}$ |

---

## 2. Complete Step-by-Step Design Calculations

### 2.1 Core Design (`cd()`)
1. **Voltage per Turn ($E_t$)**:
   $$E_t = K \cdot \sqrt{\text{kVA}} = 0.45 \cdot \sqrt{200} = 6.36396\text{ V} \approx 6.364\text{ V}$$

2. **Main Core Magnetic Flux ($\Phi_m$)**:
   $$\Phi_m = \frac{E_t}{4.44 \cdot f} = \frac{6.36396}{4.44 \times 50} = 0.028666\text{ Wb}$$

3. **Net Iron Area ($A_i$) & Gross Iron Area ($A_{gi}$)**:
   $$A_i = \frac{\Phi_m}{B_m} = \frac{0.028666}{1.0} = 0.028666\text{ m}^2 = 28.666 \times 10^3\text{ mm}^2$$
   $$A_{gi} = \frac{A_i}{K_i} = \frac{0.028666}{0.90} = 0.031852\text{ m}^2 = 31.852 \times 10^3\text{ mm}^2$$

4. **Circumscribing Circle Diameter ($d$)**:
   Using a Cruciform core section where $A_i = 0.56 d^2$:
   $$d = \sqrt{\frac{A_i}{0.56}} = \sqrt{\frac{0.028666}{0.56}} = 0.22625\text{ m} \approx 0.2263\text{ m} = 226.3\text{ mm}$$

5. **Cruciform Lamination Stepping Widths ($p, q$)**:
   - Large plate width: $p = 0.85 d = 0.85 \times 0.22625 = 0.1923\text{ m} \approx 0.192\text{ m} = 192\text{ mm}$
   - Small plate width: $q = 0.53 d = 0.53 \times 0.22625 = 0.1199\text{ m} \approx 0.120\text{ m} = 120\text{ mm}$

---

### 2.2 Window Dimensions (`wd()`)
1. **Window Space Factor ($K_w$)**:
   $$K_w = \frac{10}{30 + 33} = 0.1587 \approx 0.160$$

2. **Window Area ($A_w$)**:
   $$A_w = \frac{\text{kVA} \times 10^3}{3.33 \cdot f \cdot B_m \cdot K_w \cdot \delta \cdot A_i \times 10^6}$$
   $$A_w = \frac{200,000}{3.33 \times 50 \times 1.0 \times 0.160 \times 2.3 \times 0.028666 \times 10^6} = 0.113866\text{ m}^2 = 113.866 \times 10^3\text{ mm}^2$$

3. **Window Height ($H_w$) & Width ($W_w$)**:
   Assuming height-to-width ratio $\frac{H_w}{W_w} = 2.5$:
   $$W_w = \sqrt{\frac{A_w}{2.5}} = \sqrt{\frac{0.113866}{2.5}} = 0.2134\text{ m} \approx 0.213\text{ m} = 213\text{ mm}$$
   $$H_w = 2.5 \cdot W_w = 2.5 \times 0.2134 = 0.5335\text{ m} \approx 0.534\text{ m} = 534\text{ mm}$$
   *Design Modification for $33\text{ kV}$ HV Insulation & Clearance*:
   $$\text{Modified } H_w = 0.850\text{ m} = 850\text{ mm}, \quad \text{Modified } W_w = 0.340\text{ m} = 340\text{ mm}$$

4. **Distance Between Adjacent Core Centers ($D$)**:
   $$D = W_w + d = 0.340 + 0.2263 = 0.5663\text{ m} \approx 0.566\text{ m} = 566\text{ mm}$$

---

### 2.3 Yoke Design (`yd()`)
1. **Yoke Area & Flux Density**:
   Taking net yoke area $A_y$ as $1.20$ times net limb area $A_i$:
   $$A_y = 1.20 \cdot A_i = 1.20 \times 0.028666 = 0.03440\text{ m}^2 = 34.40 \times 10^3\text{ mm}^2$$
   $$B_{dy} = \frac{B_m}{1.20} = \frac{1.0}{1.20} = 0.8333\text{ Wb/m}^2$$
   $$A_{gy} = \frac{A_y}{K_i} = \frac{0.03440}{0.90} = 0.038222\text{ m}^2 = 38.222 \times 10^3\text{ mm}^2$$

2. **Yoke Dimensions ($D_y, H_y$)**:
   $$D_y = p = 0.192\text{ m} = 192\text{ mm}$$
   $$H_y = \frac{A_{gy}}{D_y} = \frac{0.038222}{0.192} = 0.199\text{ m} \approx 0.200\text{ m} = 200\text{ mm}$$

---

### 2.4 Overall Frame Dimensions (`od()`)
- **Distance between centers ($D$)**: $0.566\text{ m} = 566\text{ mm}$
- **Overall Height ($H$)**: $H = H_w + 2 H_y = 0.850 + 2(0.200) = 1.250\text{ m} = 1,250\text{ mm}$
- **Overall Width ($W$)**: $W = 2D + p = 2(0.566) + 0.192 = 1.325\text{ m} = 1,325\text{ mm}$
- **Overall Depth ($D_f$)**: $D_f = p = 0.192\text{ m} = 192\text{ mm}$

---

### 2.5 Low Voltage (LV) Winding Design (`lvw()`)
1. **Secondary Voltages & Currents**:
   - Connection: **Star**
   - Secondary Line Voltage $V_{ls} = 433\text{ V}$
   - Secondary Phase Voltage $V_{sp} = \frac{433}{\sqrt{3}} = 249.99\text{ V} \approx 250\text{ V}$
   - Secondary Turns per Phase:
     $$T_s = \frac{V_{sp}}{E_t} = \frac{250}{6.364} = 39.28 \approx 39\text{ turns}$$
   - Secondary Current per Phase:
     $$I_{sp} = \frac{\text{kVA} \times 1000}{3 \cdot V_{sp}} = \frac{200,000}{3 \times 250} = 266.67\text{ A}$$

2. **LV Conductor Selection**:
   - Required Area: $a_s = \frac{I_{sp}}{\delta} = \frac{266.67}{2.3} = 115.95\text{ mm}^2$
   - Selection: Rectangular strip conductor $15.0\text{ mm} \times 7.8\text{ mm}$
   - Bare area $a_{s1} = 117.0\text{ mm}^2$, Actual current density $\delta_1 = \frac{266.67}{117.0} = 2.28\text{ A/mm}^2$
   - Insulated dimensions ($z = 0.5\text{ mm}$ paper covering): $X_1 = 15.5\text{ mm}, Y_1 = 8.3\text{ mm}$

3. **Layer Distribution & Axial Depth**:
   - Number of layers $= 2$
   - Turns along axial depth: $T_{s1} = \frac{39}{2} + 1 = 20.5 \approx 20\text{ turns}$
   - Winding axial depth: $L_{cs} = 20 \times 15.5 = 310.0\text{ mm}$
   - Axial Clearance Guard Check:
     $$\text{cls} = \frac{(H_w \times 1000) - L_{cs}}{2} = \frac{850 - 310}{2} = 270.0\text{ mm} \ge 15\text{ mm} \quad (\mathbf{PASS})$$

4. **Radial Depth & Diameters**:
   - Pressboard cylinder thickness $cly = 1.0\text{ mm}$, Core-LV insulation $lvi = 2.5\text{ mm}$
   - Radial depth: $b_s = 2 \cdot Y_1 + 2 \cdot cly = 2(8.3) + 2(1.0) = 18.6\text{ mm}$
   - Inside Diameter: $I_d = d \cdot 1000 + 2 \cdot lvi = 226.25 + 2(2.5) = 231.25\text{ mm}$
   - Outside Diameter: $O_d = I_d + 2 b_s = 231.25 + 2(18.6) = 268.45\text{ mm}$

---

### 2.6 High Voltage (HV) Winding Design (`hvw()`)
1. **Primary Voltage & Base Turns**:
   - Connection: **Delta**
   - Primary Phase Voltage $V_{pp} = V_{lp} = 33,000\text{ V}$
   - Base Primary Turns per Phase:
     $$T_p = \frac{T_s \cdot V_{pp}}{V_{sp}} = \frac{39 \times 33,000}{250} = 5,148\text{ turns}$$
   - With $+5.0\%$ tapping allowance:
     $$T_{p1} = 1.05 \cdot T_p = 1.05 \times 5,148 = 5,405\text{ turns}$$

2. **Coil Arrangement & Conductor Sizing**:
   - Crossover winding with $N_c = 22$ coils (20 normal coils of 246 turns + 2 reinforced coils of 485 turns)
   - Layers per coil $N_{cl} = 10$, Turns per layer $T_{ncl} = 25$
   - Primary Current: $I_{pp} = \frac{200,000}{3 \times 33,000} = 2.020\text{ A}$
   - Conductor Area: $a_p = \frac{2.020}{2.3} = 0.878\text{ mm}^2$
   - Standard Round Conductor (Table 23.7): Bare diameter $d_{p1} = 1.06\text{ mm}$, Insulated diameter $d_{p2} = 1.18\text{ mm}$
   - Modified area $a_{p1} = \frac{\pi \times 1.06^2}{4} = 0.882\text{ mm}^2$, Actual current density $\delta_1 = 2.289\text{ A/mm}^2$

3. **HV Dimensions & Clearances**:
   - Axial depth per coil: $H_{lp} = T_{ncl} \cdot d_{p2} = 25 \times 1.18 = 29.5\text{ mm}$
   - Spacer height between coils $d_{bc} = 5.0\text{ mm}$
   - Total HV Axial Length: $L_{cp} = 22(29.5) + 22(5.0) = 759.0\text{ mm}$
   - Axial Clearance Check:
     $$\text{clc} = \frac{850 - 759}{2} = 45.5\text{ mm} \ge 5\text{ mm} \quad (\mathbf{PASS})$$
   - Radial depth of HV coil: $b_p = N_{cl} \cdot d_{p2} + (N_{cl}-1) \cdot t_i = 10(1.18) + 9(0.3) = 14.5\text{ mm}$
   - Major LV-HV Insulation: $T = 5 + \frac{0.9 \cdot V_{lp}}{1000} = 5 + 0.9(33) = 34.7\text{ mm}$
   - Inside Diameter: $ID_{hv} = O_d + 2T = 268.45 + 2(34.7) = 337.85\text{ mm}$
   - Outside Diameter: $OD_{hv} = ID_{hv} + 2 b_p = 337.85 + 2(14.5) = 366.85\text{ mm}$

---

### 2.7 Resistance Calculations (`resis()`)
1. **HV Winding Resistance**:
   - Mean Turn Diameter: $D_{pm} = \frac{ID_{hv} + OD_{hv}}{2} = \frac{337.85 + 366.85}{2} = 352.35\text{ mm}$
   - Mean Length of Turn: $L_{mtp} = \pi \cdot \frac{D_{pm}}{1000} = \pi \times 0.35235 = 1.107\text{ m}$
   - Phase Resistance at $75^\circ\text{C}$ ($\rho_p = 0.021\ \Omega\cdot\text{mm}^2/\text{m}$):
     $$R_p = \frac{T_p \cdot L_{mtp} \cdot \rho_p}{a_{p1}} = \frac{5405 \times 1.107 \times 0.021}{0.882} = 135.61\ \Omega$$

2. **LV Winding Resistance**:
   - Mean Turn Diameter: $D_{sm} = \frac{I_d + O_d}{2} = \frac{231.25 + 268.45}{2} = 249.85\text{ mm}$
   - Mean Length of Turn: $L_{mts} = \pi \cdot \frac{D_{sm}}{1000} = \pi \times 0.24985 = 0.785\text{ m}$
   - Phase Resistance at $75^\circ\text{C}$ ($\rho_s = 0.021\ \Omega\cdot\text{mm}^2/\text{m}$):
     $$R_s = \frac{T_s \cdot L_{mts} \cdot \rho_s}{a_{s1}} = \frac{39 \times 0.785 \times 0.021}{117.0} = 0.0055\ \Omega$$

3. **Equivalent Resistance Referred to Primary ($R_{ef}$)**:
   $$R_{ef} = R_p + \left(\frac{T_p}{T_s}\right)^2 R_s = 135.61 + \left(\frac{5405}{39}\right)^2 \times 0.0055 = 231.34\ \Omega$$

4. **Per Unit Resistance ($\epsilon_p$)**:
   $$\epsilon_p = \frac{I_{pp} \cdot R_{ef}}{V_{lp}} = \frac{2.020 \times 231.34}{33,000} = 0.0142 \quad (\mathbf{1.42\%})$$

---

### 2.8 Leakage Reactance & Impedance (`lr()`)
1. **Mean Winding Diameter ($D_m$) & Mean Turn Length ($L_{mt}$)**:
   $$D_m = \frac{I_d + OD_{hv}}{2} = \frac{231.25 + 366.85}{2} = 299.05\text{ mm}$$
   $$L_{mt} = \pi \cdot \frac{D_m}{1000} = \pi \times 0.29905 = 0.940\text{ m}$$

2. **Mean Axial Length of Winding ($L_c$)**:
   $$L_c = \frac{L_{cp} + L_{cs}}{2} = \frac{759.0 + 310.0}{2} = 534.5\text{ mm}$$

3. **Primary Leakage Reactance ($X_p$)**:
   $$X_p = \frac{2\pi f \mu_0 T_p^2 L_{mt}}{L_c} \left( T + \frac{b_p + b_s}{3} \right)$$
   $$X_p = \frac{2\pi \times 50 \times (1.256 \times 10^{-6}) \times 5405^2 \times 0.940}{0.5345} \left( 34.7 + \frac{14.5 + 18.6}{3} \right) \times 10^{-3} = 840.62\ \Omega$$

4. **Per Unit Reactance ($\epsilon_x$) & Impedance ($\epsilon_z$)**:
   $$\epsilon_x = \frac{I_{pp} \cdot X_p}{V_{pp}} = \frac{2.020 \times 840.62}{33,000} = 0.051 \quad (\mathbf{5.1\%})$$
   $$\epsilon_z = \sqrt{\epsilon_p^2 + \epsilon_x^2} = \sqrt{0.0142^2 + 0.051^2} = 0.053 \quad (\mathbf{5.3\%})$$

---

### 2.9 Voltage Regulation (`reg()`)
Full load voltage regulation at $0.8$ lagging power factor ($\cos\phi = 0.8, \sin\phi = 0.6$):
$$\text{Regulation (\%)} = (\epsilon_p \cdot 0.8 + \epsilon_x \cdot 0.6) \times 100$$
$$\text{Regulation (\%)} = (0.0142 \times 0.8 + 0.051 \times 0.6) \times 100 = 0.01136 + 0.0306 = \mathbf{4.22\%}$$

---

### 2.10 Losses Calculation (`cl()`)
1. **Copper Losses**:
   - $I^2R$ Loss: $L_{i2r} = 3 \cdot I_{pp}^2 \cdot R_{ef} = 3 \times (2.020)^2 \times 231.34 = 2,832.5\text{ W}$
   - Total Copper Loss ($10\%$ Stray Loss): $P_{i2r} = 1.10 \times 2,832.5 = 3,115.7\text{ W}$

2. **Core Weights & Losses**:
   - Limb Weight ($N_l = 3$): $W_l = N_l \cdot H_w \cdot A_i \cdot \gamma = 3 \times 0.850 \times 0.028666 \times 7600 = 555.56\text{ kg}$
   - Core Loss in Limbs ($1.5\text{ W/kg}$): $L_{cl} = 555.56 \times 1.5 = 833.3\text{ W}$
   - Yoke Weight ($N_y = 2$): $W_y = N_y \cdot W \cdot A_y \cdot \gamma = 2 \times 1.325 \times 0.03440 \times 7600 = 692.55\text{ kg}$
   - Core Loss in Yokes ($1.5\text{ W/kg}$): $L_{yl} = 692.55 \times 1.5 = 1,038.8\text{ W}$
   - Total Core Loss: $P_i = L_{cl} + L_{yl} = 833.3 + 1038.8 = 1,872.2\text{ W}$

---

### 2.11 Efficiency Analysis (`effi()`)
1. **Total Full-Load Losses ($L_t$)**:
   $$L_t = P_i + P_{i2r} = 1,872.2 + 3,115.7 = 4,987.9\text{ W} = 4.988\text{ kW}$$

2. **Full-Load Efficiency ($\eta$)**:
   $$\eta = \left( \frac{\text{kVA} \times 1000}{\text{kVA} \times 1000 + L_t} \right) \times 100 = \left( \frac{200,000}{204,987.9} \right) \times 100 = \mathbf{97.57\%}$$

3. **Maximum Efficiency Load Fraction ($x$)**:
   $$x = \sqrt{\frac{P_i}{P_{i2r}}} = \sqrt{\frac{1872.2}{3115.7}} = \mathbf{0.775} \quad (\mathbf{77.5\%\text{ of Full Load}})$$

---

### 2.12 No-Load Magnetizing & Loss Current (`nlc()`)
1. **Magnetizing MMF ($M_{mmf}$)**:
   Taking specific mmf $at_c = 250\text{ A/m}$ (core) and $at_y = 200\text{ A/m}$ (yoke):
   $$M_{mmf} = N_l \cdot H_w \cdot at_c + N_y \cdot W \cdot at_y = 3(0.850)(250) + 2(1.325)(200) = 637.5 + 530.0 = 1,167.3\text{ AT}$$
   $$AT_o = \frac{M_{mmf}}{m} = \frac{1167.3}{3} = 389.1\text{ AT/phase}$$

2. **Current Components**:
   - Magnetizing Current: $I_m = \frac{AT_o}{\sqrt{2} \cdot T_p} = \frac{389.1}{1.4142 \times 5148} = 0.05345\text{ A}$
   - Core Loss Current: $I_l = \frac{P_i}{V_{pp} \cdot m} = \frac{1872.2}{33000 \times 3} = 0.01891\text{ A}$
   - Total No-Load Current: $I_o = \sqrt{I_m^2 + I_l^2} = \sqrt{0.05345^2 + 0.01891^2} = 0.05669\text{ A}$

3. **Percentage No-Load Current Guard Check**:
   $$\% I_o = \left( \frac{I_o}{I_{pp}} \right) \times 100 = \left( \frac{0.05669}{2.020} \right) \times 100 = \mathbf{2.8\%} \le 5.0\% \quad (\mathbf{PASS})$$

---

## 3. Exact Outputs from C Program (`machine.c`)

Below are the exact contents generated in the 12 output files by running [`machine.exe`](file:///c:/Users/Shivam/Desktop/Machine_Design/machine.exe):

````carousel
```text
=== CD.txt ===
******************************************************************
		CORE DESIGN OF THE TRANSFORMER
******************************************************************
kVA rating of the transformer is 200.00 kVA
Value of K is 0.45
Voltage per Turn is 6.36 V
Line frequency is 50 Hz
Number of phase of the transformer is 3.00
Flux in the core is 0.028666 Wb
Flux density is 1.0000 Wb/m^2
Net iron area is 0.028666 m^2
Stacking factor is 0.90
Gross Iron area is 0.031852 m^2
Type of the core is Cruciform
Diameter of the core is 0.2263 m
Dimension is 0.192 * 0.120
```
<!-- slide -->
```text
=== WD.txt ===
******************************************************************
		WINDOW DIMENSION OF THE TRANSFORMER
******************************************************************
Primary Winding Voltage is 33 KV
Window Space factor is 0.190
Modified Window Space factor is 0.160
Flux Density is 1.0000 Wb
Current Density is 2.30 A/mm^2
Area of the window is 0.113866 m^2
Ratio-Height to Width of the window is 2.5
Width of the Window is 0.213 m
Height of the Window is 0.534 m
Modified height of the window = 0.850 m 
 Modified width of the Window = 0.340 m
Distance between adjacent core is 0.566 m
```
<!-- slide -->
```text
=== YD.txt ===
******************************************************************
		YOKE DIMENSION OF THE TRANSFORMER
******************************************************************
The ratio-area of yoke to limbs 1.20
Flux Density in the Yoke 0.833333 Wb/m^2
Area of the Yoke is 0.034400 m^2
Gross area of the Yoke is 0.038222 m^02
Depth of the Yoke is 0.192 m
Height of the Yoke is 0.200 m
```
<!-- slide -->
```text
=== OD.txt ===
******************************************************************
		OVERALL DIMENSION OF THE TRANSFORMER
******************************************************************
Distance between adjacent core centers is 0.566 m
Height of the frame is 1.250 m
Width of the Frame is 1.325 m
Depth of the Frame is 0.192 m
```
<!-- slide -->
```text
=== LVD.txt ===
******************************************************************
		LOW VOLTAGE WINDING CALCULATION OF THE TRANSFORMER
******************************************************************
Secondary Line Voltage is 433.00 V
Connection Type is Star
Phase Voltage is 249.993 V
Turn per Phase is 39.00
Secondary Current per phase is 266.674 A
Current Density in Secondary phase is 2.30 A/mm^2
Total Area of Secondary Conductor is 115.945 mm^2
 Dimension of the Conductor is 15.000 * 7.800
Modified area of Secondary Conductor is 117.000 mm^2
Modified Current Density in Secondary phase is 2.28 A/mm^2
Covering of Conductor is 0.500 mm
 Dimension of the conductor with covering is 15.500 * 8.300
Number of layer is used is 2
Using helical winding space to be provided 20.00 turns along the axis
Turns along the axial depth is 20.00
Axial depth of the Winding ls 310.000 mm
Clearance is 270.000 mm
 Thickness of the pressboard cylinders is 1.000 mm
lnsulations b/w lv winding and core is 2.500 mm
 Diameter of the circumscribing circle is 0.226 mm
 Inside diameter is 231.252 mm
Outside diameter is 268.452 mm
```
<!-- slide -->
```text
=== HVD.txt ===
******************************************************************
		HIGH VOLTAGE WINDING DESIGN OF THE TRANSFORMER
******************************************************************
The primary line voltage is 33000.00 V
Connection type is delta
Primary phase voltage is 33000.000 V
Primary turn per phase is 5148 
Tapping is considered here
Percentage of Tapping is 5.000 
Primary Turns per Phase with 5.000 tapping is  5405
Crossover winding is used here.
The value of voltage per coil is 1500.000 V
Number of coil is 22
Modified number of coils is 22
Modified value of voltage per coil is 1500.000 V
Turns per coil is 245.699997
Number of normal coil is 20
Turns in the normal coil is 246
Reinforced turns in remaining 2 coil is 485
Number of layers is 10 
Turns per layer is 25
Primary current per phase is 2.020 A
Current is below 20A. Cross over winding is used here.
Current density in the primary conductor is 2.300 A/mm^2
 Area of the primary conductor is 0.878 mm^2
Diameter of the primary conductor is 1.058 mm
Standard value of the diameter(Ref Table 23.7)is 1.060 mm
Standard value of the diameter proper insulation is 1.180 mm
Modified area of the primary conductor is 0.882 mm^2
Modified current density in the primary conductor is 2.289 A/mm^2
Axial depth of coil is 29.500
Spacers between adjacent coils are given of 5.0 mm
Axial length of the hv winding is 759.000 mm
Clearance is 45.500 mm
Thickness of the insulation between the layers is 0.300 mm
Radial depth of the coil is 14.500 mm
Thickness of the insulation b/w LV and HV is 34.700 mm
Inside diameter of the HV is 337.852 mm
Outside diameter of HV is 366.852 mm
```
<!-- slide -->
```text
=== RESIS.txt ===
******************************************************************
		RESISTANCE DESIGN OF THE TRANSFORMER
******************************************************************
Mean diameter of the HV winding is 352.352 mm
Length of mean turn in HV winding is 1.107
Resistivity of the material is 0.0210
Resistance in the HV side is 135.6074
Mean diameter of the LV winding is 249.852 mm
Length of mean turn in LV winding is 0.785
Resistivity of the material is 0.0210
Resistance in the LV side is 0.0055
Resistance reffered to primary side is 231.3443 Ohm
Per Unit Resistance is 0.0142
```
<!-- slide -->
```text
=== LEAKAGE.txt ===
******************************************************************
		CALCULATION OF LEAKAGE REACTANCE OF THE TRANSFORMER
******************************************************************
Mean diameter of winding is 299.052 mm 
Length of mean turn of winding is 0.940 m
Mean Axial Length of the winding is 534.500 mm
Leakage reactance reffered to primary side is 840.619 Ohm
Per Unit leakage reactance is 0.051 
Per Unit Impedance is 0.053
```
<!-- slide -->
```text
=== REGULATION.txt ===
******************************************************************
		CALCULATION OF REGULATION OF THE TRANSFORMER
******************************************************************
Regulation of the Transformer is 4.22%
```
<!-- slide -->
```text
=== LOSSES.txt ===
******************************************************************
		CALCULATION OF LOSSES OF THE TRANSFORMER
******************************************************************
I^2R Loss
I^2R Loss is 2832.498 W
Percentage Stray Loss is 10.000
I^R Loss including Stray Loss is 3115.748 W
CORE Loss
Density of Lamination is 7600.000 Kg/m^2
Weight of the Limbs is 555.557 Kg
Specific Core Loss is 1.500 W/kg
Core Loss in the Limbs is 833.335 W
Density of Lamination is 7600.000 Kg/m^2
Weight of the Yokes is 692.553 Kg
Specific Core Loss is 1.500 W/kg
Core Loss in the Yoke is 1038.829 W
Total Core Loss is 1872.164 W
```
<!-- slide -->
```text
=== EFFICIENCY.txt ===
******************************************************************
		CALCULATION OF EFFECIENCY OF THE TRANSFORMER
******************************************************************
Total Loss is 4987.912 W
Efficiency of the transformer is 97.57
Condition for Maximum Efficiency is 0.775
```
<!-- slide -->
```text
=== NLC.txt ===
******************************************************************
		NO LOAD CURRENT CALCULATION OF THE TRANSFORMER
******************************************************************
Value 'at' of core corresponding to the flux density in core is 250.00 A/m
Value 'at' of yoke corresponding to the flux density in yoke is 200.00 A/m
Total Magnetizing current is 1167.302 A
Magnetizing mmf per Phase is 389.101 A
Magnetizing Current is 0.05345 A
Loss Component of the No Load Current is 0.01891 A
No Load Current is 0.05669 A
No Load Current as a percentage of Full Load Current is 2.8
```
````

---

## 4. Design Validation & Performance Summary

| Performance Metric | Calculated Value | Standard Criteria | Status |
| :--- | :--- | :--- | :--- |
| **LV Winding Clearance (`cls`)** | $270.0\text{ mm}$ | $\ge 15.0\text{ mm}$ | $\mathbf{PASS}$ |
| **HV Winding Clearance (`clc`)** | $45.5\text{ mm}$ | $\ge 5.0\text{ mm}$ | $\mathbf{PASS}$ |
| **No-Load Current ($\% I_o$)** | $2.8\%$ | $\le 5.0\%$ | $\mathbf{PASS}$ |
| **Per-Unit Resistance ($\epsilon_p$)** | $1.42\%$ | $1.0\text{--}2.0\%$ | $\mathbf{PASS}$ |
| **Per-Unit Reactance ($\epsilon_x$)** | $5.10\%$ | $4.0\text{--}6.0\%$ | $\mathbf{PASS}$ |
| **Full Load Efficiency ($\eta$)** | $97.57\%$ | $97.0\text{--}98.5\%$ | $\mathbf{PASS}$ |
| **Voltage Regulation (0.8 Lag)** | $4.22\%$ | $3.5\text{--}5.0\%$ | $\mathbf{PASS}$ |
| **Max Efficiency Loading ($x$)** | $77.5\%$ | $70\text{--}80\%$ | $\mathbf{PASS}$ |

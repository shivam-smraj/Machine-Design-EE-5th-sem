# Detailed Technical Documentation: `machine.c` (Transformer Design Software)

## 1. Executive Summary

The C program [`machine.c`](file:///c:/Users/Shivam/Desktop/Machine_Design/machine.c) is an interactive, step-by-step CAD (Computer-Aided Design) software tool written for **Electrical Machine Design**, specifically targeting **3-Phase and Single-Phase Electrical Transformers** (both Distribution Transformers and Power Transformers).

It performs detailed analytical calculations adhering to classical electrical design principles (such as those outlined in A.K. Sawhney's *A Course in Electrical Machine Design*). The program covers:
- Core geometry and stepped cross-section design.
- Window dimensions and frame layout.
- Yoke dimensions and overall transformer frame sizing.
- Low Voltage (LV) and High Voltage (HV) winding design, turn counts, conductor sizing, and insulation clearance validation.
- Electrical parameters: Resistance (HV, LV, equivalent referred to primary), Leakage Reactance, and Voltage Regulation.
- Losses: Copper loss ($I^2R$), stray load loss, core losses in limbs and yokes.
- Performance metrics: Full-load efficiency, maximum efficiency load fraction, and no-load magnetizing/loss current.

During execution, the program exports formatted technical summary reports into **12 distinct text files** corresponding to each design stage.

---

## 2. Program Structure & Architecture

### 2.1 Technical Specifications

| Parameter | Details |
| :--- | :--- |
| **Language** | C (C89 / C99 compatible with standard C libraries) |
| **Libraries Used** | `<stdio.h>`, `<conio.h>`, `<math.h>` |
| **Constants** | $\pi = 3.141592654$, $\mu_0 = 1.256 \times 10^{-6}\text{ H/m}$ |
| **Execution Paradigm** | Interactive CLI with `scanf()` prompts, validation loops, and file reporting (`fprintf`) |

### 2.2 Global State & Data Flow

The program utilizes global variables to pass calculated physical and electrical properties across sequential execution stages:

```
[main()]
   │
   ├── 1. cd()    ──> Outputs CD.txt         (Core Design & Flux Calculation)
   ├── 2. wd()    ──> Outputs WD.txt         (Window Dimensions & Core Center Distance)
   ├── 3. yd()    ──> Outputs YD.txt         (Yoke Sizing & Geometry)
   ├── 4. od()    ──> Outputs OD.txt         (Overall Frame Sizing: H, W, Df)
   ├── 5. lvw()   ──> Outputs LVD.txt        (LV Winding, Turns, Conductor Area & Clearances)
   ├── 6. hvw()   ──> Outputs HVD.txt        (HV Winding, Tappings, Coils, Layers & Clearances)
   ├── 7. resis() ──> Outputs RESIS.txt      (Resistances & Per-Unit Resistance)
   ├── 8. lr()    ──> Outputs LEAKAGE.txt    (Leakage Reactance & Per-Unit Impedance)
   ├── 9. reg()   ──> Outputs REGULATION.txt (Voltage Regulation at 0.8 Lagging PF)
   ├── 10. cl()   ──> Outputs LOSSES.txt     (Copper, Stray & Core Losses)
   ├── 11. effi() ──> Outputs EFFICIENCY.txt (Full-Load & Max Efficiency Point)
   └── 12. nlc()  ──> Outputs NLC.txt        (No-Load Magnetizing & Loss Current [Distribution])
```

---

## 3. Function-by-Function Technical Analysis

### 3.1 `main()` — Program Entry & Control Flow
- **Purpose**: Solicits transformer classification (1 for Distribution, 2 for Power) and invokes design functions sequentially.
- **Conditional Logic**: Calls `nlc()` (No-Load Current calculation) only if the transformer type is Distribution (`type == 1`).

---

### 3.2 `cd()` — Core Design
Calculates magnetic flux, net/gross iron cross-sectional areas, and core stepping geometry.

#### Mathematical Formulas & Logic:
1. **Voltage per Turn ($E_t$)**:
   $$E_t = K \cdot \sqrt{\text{kVA}}$$
   *(where $K = 0.45$ for distribution transformers, $K = 0.6 \text{ to } 0.7$ for power transformers)*
2. **Main Core Flux ($\Phi_m$)**:
   $$\Phi_m = \frac{E_t}{4.44 \cdot f}$$
3. **Net Iron Area ($A_i$) & Gross Iron Area ($A_{gi}$)**:
   $$A_i = \frac{\Phi_m}{B_m}, \quad A_{gi} = \frac{A_i}{K_i}$$
   *(where $B_m$ is flux density in $\text{Wb/m}^2$, $K_i$ is stacking factor $\approx 0.9$)*
4. **Circumscribing Circle Diameter ($d$)**:
   $$d = \sqrt{\frac{A_i}{C_t}}$$
   Supported Core Stepping Types:
   - **Square Core** ($C_t = 0.45$): Dimension $p = \sqrt{0.5} \cdot d$
   - **Cruciform Core** ($C_t = 0.56$): Dimensions $p = 0.85d$, $q = 0.53d$
   - **3-Stepped Core** ($C_t = 0.60$): Dimensions $p = 0.9d$, $q = 0.7d$, $r = 0.42d$
   - **4-Stepped Core** ($C_t = 0.62$): Dimensions $s = 0.92d$, $r = 0.78d$, $q = 0.36d$, $p = 0.36d$
- **Output File**: `CD.txt`

---

### 3.3 `wd()` — Window Dimension Calculation
Determines the window area ($A_w$), window height ($H_w$), window width ($W_w$), and center-to-center distance between adjacent core limbs ($D$).

#### Mathematical Formulas & Logic:
1. **Window Space Factor ($K_w$)**:
   $$K_w = \begin{cases} \frac{8}{30 + KV} & \text{if } 1 \le \text{kVA} < 50 \\ \frac{10}{30 + KV} & \text{if } 50 \le \text{kVA} < 200 \\ \frac{12}{30 + KV} & \text{if } \text{kVA} \ge 200 \end{cases}$$
2. **Window Area ($A_w$)**:
   $$A_w = \frac{\text{kVA} \times 10^3}{3.33 \cdot f \cdot B_m \cdot K_w \cdot \delta \cdot A_i \times 10^6}$$
3. **Window Width ($W_w$) & Height ($H_w$)**:
   $$W_w = \sqrt{\frac{A_w}{\text{ratio1}}}, \quad H_w = \text{ratio1} \cdot W_w \quad (\text{ratio1} = H_w/W_w \in [2, 4])$$
4. **Core Center Distance ($D$)**:
   $$D = W_w + d$$
- **Output File**: `WD.txt`

---

### 3.4 `yd()` — Yoke Design
Computes the yoke cross-section, yoke flux density ($B_{dy}$), net yoke area ($A_y$), gross yoke area ($A_{gy}$), yoke depth ($D_y$), and yoke height ($H_y$).

#### Mathematical Formulas & Logic:
- **Flux Density in Yoke**: $B_{dy} = B_m / \text{ratio1}$ (where yoke area is $5\text{--}25\%$ larger than limb area).
- **Yoke Areas**: $A_y = \text{ratio1} \cdot A_i$, $A_{gy} = A_y / K_i$.
- **Yoke Depth & Height**: $D_y = p$, $H_y = A_{gy} / D_y$.
- **Output File**: `YD.txt`

---

### 3.5 `od()` — Overall Frame Dimensions
Computes total frame dimensions for mounting and enclosure design.

#### Mathematical Formulas:
- **Distance between adjacent core centers**: $D = d + W_w$
- **Overall Height ($H$)**: $H = H_w + 2 \cdot H_y$
- **Overall Width ($W$)**: $W = 2 \cdot D + p$
- **Overall Depth ($D_f$)**: $D_f = p$
- **Output File**: `OD.txt`

---

### 3.6 `lvw()` — Low Voltage (LV) Winding Design
Calculates LV winding parameters including secondary phase current, conductor area, helical turn distribution, layer arrangement, radial depth, and clearance verification.

#### Mathematical Formulas & Validation:
1. **Secondary Phase Voltage ($V_{sp}$)**:
   $$V_{sp} = \begin{cases} \frac{V_{ls}}{\sqrt{3}} & \text{Star Connection} \\ V_{ls} & \text{Delta Connection} \end{cases}$$
2. **Turns per Phase ($T_s$) & Secondary Phase Current ($I_{sp}$)**:
   $$T_s = \frac{V_{sp}}{E_t}, \quad I_{sp} = \frac{\text{kVA} \times 1000}{3 \cdot V_{sp}}$$
3. **Conductor Area ($a_s$)**: $a_s = I_{sp} / \delta$
4. **Dimensions with Insulation Covering ($X_1, Y_1$)**:
   $$X_1 = x + z, \quad Y_1 = y + z$$
5. **Axial Depth ($L_{cs}$)**: $L_{cs} = T_{s1} \cdot X_1$
6. **Axial Clearance Check**:
   $$\text{cls} = \frac{(H_w \times 1000) - L_{cs}}{2}$$
   *Validation*: If $\text{cls} < 15\text{ mm}$, the program prints a warning and triggers a `goto conductor` retry loop.
7. **Radial Depth ($b_s$) & Diameters ($I_d, O_d$)**:
   $$b_s = \text{lay} \cdot Y_1 + 2 \cdot cly, \quad I_d = d \cdot 1000 + 2 \cdot lvi, \quad O_d = I_d + 2 \cdot b_s$$
- **Output File**: `LVD.txt`

---

### 3.7 `hvw()` — High Voltage (HV) Winding Design
Calculates primary winding turns, tapping adjustments, crossover/layer winding options, coil sizing, radial depth, inside/outside diameters, and axial clearances.

#### Key Steps & Formulas:
1. **Primary Phase Voltage ($V_{pp}$)**: $V_{pp} = V_{lp}/\sqrt{3}$ (Star) or $V_{lp}$ (Delta).
2. **Base Primary Turns ($T_p$) & Tappings ($T_{p1}$)**:
   $$T_p = \frac{T_s \cdot V_{pp}}{V_{sp}}, \quad T_{p1} = \left(1 + \frac{t_p}{100}\right) \cdot T_p$$
3. **Coil & Layer Distribution**:
   $$N_c = \frac{V_{lp}}{V_c}, \quad V_{c1} = \frac{V_{pp}}{N_c}, \quad t_c = \frac{T_{p1}}{N_c}$$
4. **Primary Phase Current ($I_{pp}$) & Conductor Sizing ($a_p$)**:
   $$I_{pp} = \frac{\text{kVA} \times 1000}{3 \cdot V_{pp}}, \quad a_p = \frac{I_{pp}}{\delta}$$
   Supports both **Round conductors** ($d_p = \sqrt{4 a_p / \pi}$) and **Rectangular conductors**.
5. **Axial Length ($L_{cp}$) & Clearance Check**:
   $$L_{cp} = N_c \cdot H_{lp} + N_c \cdot d_{bc}, \quad \text{clc} = \frac{(H_w \cdot 1000) - L_{cp}}{2}$$
   *Validation*: If $\text{clc} < 5\text{ mm}$, recalculation is enforced via `goto cal`.
6. **HV Diameters ($ID_{hv}, OD_{hv}$)**:
   $$T = 5 + \frac{0.9 \cdot V_{lp}}{1000}, \quad ID_{hv} = O_d + 2T, \quad OD_{hv} = ID_{hv} + 2 b_p$$
- **Output File**: `HVD.txt`

---

### 3.8 `resis()` — Winding Resistance Calculations
Determines mean turn lengths and resistance for both HV and LV windings, and calculates the total equivalent resistance referred to the primary side.

#### Mathematical Formulas:
- **HV Mean Turn Length ($L_{mtp}$)**: $L_{mtp} = \pi \cdot \frac{ID_{hv} + OD_{hv}}{2000}$
- **HV Resistance per Phase ($R_p$)**: $R_p = \frac{T_p \cdot L_{mtp} \cdot \rho_p}{a_{p1}}$
- **LV Mean Turn Length ($L_{mts}$)**: $L_{mts} = \pi \cdot \frac{I_d + O_d}{2000}$
- **LV Resistance per Phase ($R_s$)**: $R_s = \frac{T_s \cdot L_{mts} \cdot \rho_s}{a_{s1}}$
- **Referred Resistance ($R_{ef}$)**:
  $$R_{ef} = R_p + \left(\frac{T_p}{T_s}\right)^2 R_s$$
- **Per Unit Resistance ($\epsilon_p$)**:
  $$\epsilon_p = \frac{I_{pp} \cdot R_{ef}}{V_{lp}}$$
- **Output File**: `RESIS.txt`

---

### 3.9 `lr()` — Leakage Reactance & Impedance
Calculates total primary-referred leakage reactance and per-unit impedance.

#### Mathematical Formulas:
- **Mean Winding Diameter ($D_m$)**: $D_m = \frac{I_d + OD_{hv}}{2}$
- **Mean Axial Winding Length ($L_c$)**: $L_c = \frac{L_{cp} + L_{cs}}{2}$
- **Primary Leakage Reactance ($X_p$)**:
  $$X_p = \frac{2\pi f \mu_0 T_p^2 L_{mt}}{L_c} \left( T + \frac{b_p + b_s}{3} \right)$$
- **Per Unit Leakage Reactance ($\epsilon_x$) & Impedance ($\epsilon_z$)**:
  $$\epsilon_x = \frac{I_{pp} \cdot X_p}{V_{pp}}, \quad \epsilon_z = \sqrt{\epsilon_p^2 + \epsilon_x^2}$$
- **Output File**: `LEAKAGE.txt`

---

### 3.10 `reg()` — Voltage Regulation
Calculates the full-load voltage regulation assuming a lagging power factor of 0.8 ($\cos\phi = 0.8, \sin\phi = 0.6$).

#### Mathematical Formula:
$$\text{Regulation (\%)} = (\epsilon_p \cdot 0.8 + \epsilon_x \cdot 0.6) \times 100$$
- **Output File**: `REGULATION.txt`

---

### 3.11 `cl()` — Loss Calculation
Computes copper loss ($I^2R$), stray load loss, core weight of limbs and yokes, and core magnetic losses.

#### Mathematical Formulas:
1. **$I^2R$ Loss ($L_{i2r}$)**: $L_{i2r} = 3 \cdot I_{pp}^2 \cdot R_{ef}$
2. **Total Copper Loss ($P_{i2r}$)**:
   $$P_{i2r} = \left(1 + \frac{L_s}{100}\right) \cdot L_{i2r} \quad (\text{where } L_s = \text{Stray loss percentage } 5\text{--}25\%)$$
3. **Limbs & Yokes Weight ($W_l, W_y$)**:
   $$W_l = N_l \cdot H_w \cdot A_i \cdot \gamma, \quad W_y = N_y \cdot W \cdot A_y \cdot \gamma \quad (\gamma = 7600\text{ kg/m}^3)$$
4. **Total Core Loss ($P_i$)**:
   $$P_i = W_l \cdot z_{\text{limb}} + W_y \cdot z_{\text{yoke}}$$
- **Output File**: `LOSSES.txt`

---

### 3.12 `effi()` — Efficiency Analysis
Computes full-load efficiency and the fraction of full load at which maximum efficiency occurs.

#### Mathematical Formulas:
1. **Total Losses ($L_t$)**: $L_t = P_i + P_{i2r}$
2. **Full Load Efficiency ($\eta$)**:
   $$\eta = \left( \frac{\text{kVA} \times 1000}{\text{kVA} \times 1000 + L_t} \right) \times 100$$
3. **Maximum Efficiency Load Fraction ($x$)**:
   $$x = \sqrt{\frac{P_i}{P_{i2r}}}$$
- **Output File**: `EFFICIENCY.txt`

---

### 3.13 `nlc()` — No-Load Current Calculation
Evaluates the magnetizing mmf, magnetizing current ($I_m$), core loss current component ($I_l$), total no-load current ($I_o$), and verifies whether $\% I_o \le 5\%$.

#### Mathematical Formulas:
1. **Total Magnetizing MMF ($M_{mmf}$)**:
   $$M_{mmf} = N_l \cdot H_w \cdot at_c + N_y \cdot W \cdot at_y$$
2. **Magnetizing Current ($I_m$)**:
   $$I_m = \frac{M_{mmf} / m}{\sqrt{2} \cdot T_p}$$
3. **Core Loss Current ($I_l$)**:
   $$I_l = \frac{P_i}{V_{pp} \cdot m}$$
4. **Total No-Load Current ($I_o$)**:
   $$I_o = \sqrt{I_m^2 + I_l^2}, \quad \% I_o = \frac{I_o}{I_{pp}} \times 100$$
- **Output File**: `NLC.txt`

---

## 4. Generated Output Files Summary

Upon completing an interactive execution run, the program produces 12 text report files in the working directory:

| Filename | Contents |
| :--- | :--- |
| `CD.txt` | Core ratings, voltage per turn, flux, net/gross iron areas, stepping dimensions |
| `WD.txt` | Window space factor, window area, width, height, center distance |
| `YD.txt` | Yoke area, gross area, flux density, yoke depth & height |
| `OD.txt` | Overall transformer frame height, width, and depth |
| `LVD.txt` | LV winding turns, phase current, conductor dimensions, layers, clearance check, inside/outside diameters |
| `HVD.txt` | HV winding turns, tappings, coil layout, conductor sizing, layer insulation, inside/outside diameters |
| `RESIS.txt` | HV & LV mean turn lengths, phase resistances, primary-referred resistance, per-unit resistance |
| `LEAKAGE.txt` | Mean winding diameter, leakage reactance, per-unit reactance, per-unit impedance |
| `REGULATION.txt` | Calculated voltage regulation percentage at 0.8 lagging power factor |
| `LOSSES.txt` | Copper loss ($I^2R$), stray load loss, limb/yoke steel weights, core losses |
| `EFFICIENCY.txt` | Total losses, full-load efficiency percentage, load fraction for maximum efficiency |
| `NLC.txt` | Magnetizing mmf, magnetizing current, loss current, no-load current percentage |

---

## 5. Architectural Evaluation & Code Quality Assessment

### Strengths
1. **Domain Accuracy**: Follows standard textbook formulas for transformer design (A.K. Sawhney / E.G. Clayton standards).
2. **Comprehensive Scope**: Integrates magnetic, geometric, electrical, loss, efficiency, and regulation design into a single software tool.
3. **Safety Checks**: Features clearance guard checks in LV (`cls >= 15 mm`) and HV (`clc >= 5 mm`), prompting the user to recalculate if dimensions are invalid.
4. **Persistent Artifact Generation**: Saves each phase into separate `.txt` files for archiving and engineering review.

### Known Limitations & Modern Refactoring Opportunities
1. **Global Variable Pollution**: Uses ~50 global variables (e.g., `Et, K, KVA, m, Bm, Ki...`). Encapsulating these inside a `struct TransformerDesign` would improve modularity and thread safety.
2. **`conio.h` Dependency**: Standardizes better on modern OS platforms by removing `<conio.h>`.
3. **Format Specifier Mismatch**: Lines 215, 640 use minor format string mismatches (e.g. printing `f` float with `%0.3f` where variable was `f` or `rop`).
4. **Hardcoded Assumptions**: Power factor is hardcoded to 0.8 in regulation; core density is hardcoded or user-entered manually.

---

## 6. How to Compile and Run

### Using GCC / MinGW:
```bash
gcc -o machine machine.c -lm
./machine
```

### Using MSVC:
```cmd
cl machine.c
machine.exe
```

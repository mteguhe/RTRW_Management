# Design System Document: Digital Civic Excellence

## 1. Overview & Creative North Star
### The Creative North Star: "The Civic Sanctuary"
This design system moves beyond the cold, utilitarian feel of typical government software. It is a "Civic Sanctuary"—a space that feels as authoritative as a legal document but as welcoming as a neighborhood gathering. 

We reject the "generic dashboard" aesthetic. Instead, we embrace **Architectural Minimalism**. The system uses intentional asymmetry, generous white space, and high-contrast editorial typography to guide the user. By treating every screen like a high-end broadsheet layout, we transform mundane administrative tasks (like "Pengajuan Surat") into a premium, dignified experience for every citizen.

---

## 2. Colors & Surface Philosophy
Our palette is rooted in a "Professional Blue" foundation, but executed through tonal depth rather than flat fills.

### The "No-Line" Rule
**Borders are a design failure.** To create a high-end feel, 1px solid lines for sectioning are strictly prohibited. Boundaries must be defined through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
2.  **Tonal Transitions:** Using depth to imply edges.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine, semi-translucent paper.
*   **Base Layer:** `surface` (#f7f9fb)
*   **Low Priority/Content Grouping:** `surface-container-low` (#f2f4f6)
*   **Active Interaction Areas:** `surface-container` (#eceef0)
*   **Prominent Floating Elements:** `surface-container-lowest` (#ffffff) — Reserved for primary cards and modals to create maximum "pop" against the gray base.

### The "Glass & Gradient" Rule
To elevate the "Modern" requirement, use **Glassmorphism** for navigation bars and floating action panels. 
*   **Effect:** Apply `surface` at 80% opacity with a 12px backdrop-blur. 
*   **Signature Textures:** For primary CTAs (e.g., "Buat Laporan Baru"), use a subtle linear gradient from `surface-tint` (#0053db) to `primary-container` (#00174b). This adds a "soul" to the button that a flat hex code cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a dual-font system to balance modern efficiency with administrative trust.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, editorial look for page titles like "Informasi Warga."
*   **Body & Labels (Inter):** The workhorse. Inter provides maximum legibility for the diverse age range of RT/RW residents. 
*   **The Hierarchy Rule:** Always pair a large `display-sm` title with a significantly smaller `label-md` uppercase sub-header. This high-contrast scale is the hallmark of premium design.

---

## 4. Elevation & Depth
We replace traditional shadows with **Tonal Layering**.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (White) card on a `surface-container-low` (Light Gray) background. This creates a "soft lift" that feels integrated, not "pasted on."
*   **Ambient Shadows:** If a card must float (e.g., a mobile "Floating Action Button"), use an extra-diffused shadow: `box-shadow: 0 10px 30px rgba(25, 28, 30, 0.06)`. Note the 6% opacity; it should be felt, not seen.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#c6c6cd) at **15% opacity**. This creates a "suggestion" of a boundary.

---

## 5. Components: Refined Primitives

### Cards & Lists
*   **Constraint:** Zero dividers. Use vertical whitespace (1.5rem to 2rem) to separate list items.
*   **Style:** `surface-container-lowest` background with `xl` (0.75rem) rounded corners. 
*   **Context:** In a list of "Status Surat," use a background tint of `secondary-container` to highlight a row instead of a line.

### Buttons
*   **Primary:** Gradient fill (Blue Tint to Deep Blue), `md` (0.375rem) radius, `title-sm` typography.
*   **Secondary:** No background, `outline-variant` (at 20% opacity) border.
*   **Tertiary:** Pure text using `on-surface-variant`.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-low` as the background fill. No border in the default state.
*   **Focus State:** Transition to a `primary` (Blue) ghost-border (20% opacity) and a subtle 2px glow.
*   **Language:** Labels must use formal Bahasa Indonesia (e.g., "Nama Lengkap" instead of "Nama").

### Citizen Status Chips
*   **Success (Selesai):** `surface` background with `on-tertiary-container` text.
*   **Warning (Proses):** `tertiary-fixed` background with `on-tertiary-fixed-variant` text.
*   **Visual Rule:** Chips must use `full` (9999px) rounding to contrast against the sharp, architectural lines of the layout.

### Contextual Component: The "Community Hero"
A large, asymmetric header for the dashboard that uses `surface-container-highest` to house the RT/RW number and current announcement, using `display-md` typography.

---

## 6. Do's and Don'ts

### Do
*   **DO** use "Bahasa Indonesia yang baik dan benar." Use "Unduh" instead of "Download."
*   **DO** lean into whitespace. If a layout feels "empty," it’s likely working.
*   **DO** use typography as the primary decoration. A large, well-placed heading is better than a generic icon.
*   **DO** ensure mobile targets are at least 44px in height, maintaining the "Mobile-First" promise.

### Don't
*   **DON'T** use black (#000000) for text. Use `on-surface` (#191c1e) to reduce eye strain and maintain a premium feel.
*   **DON'T** use 100% opaque borders. They clutter the "Sanctuary" and make the app look like a legacy system.
*   **DON'T** use generic "Material Design" blue. Stick strictly to the defined `surface-tint` and `primary` tokens.
*   **DON'T** use icons without labels. In a community setting, clarity for older users is paramount.
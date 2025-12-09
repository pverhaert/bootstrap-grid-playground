# AGENTS.md

## Project Identity
**Name:** Bootstrap 5.3 Grid Mastery Playground  
**Goal:** Create a tactile, highly interactive single-page application (SPA) for students to learn the Bootstrap Grid system. The tool must be "What You See Is What You Get" (WYSIWYG).  
**Vibe:** Academic yet modern, fast, responsive, and code-centric.  
**Target Audience:** Web design students learning the difference between container types, gutters, and responsive breakpoints.

---

## Project Structure
```
Bootstrap_playground/
├── index.html      # Main HTML skeleton with app structure
├── styles.css      # Custom styles for playground UI
├── script.js       # Vanilla JS application logic
└── AGENTS.md       # Project documentation
```

---

## Tech Stack & Constraints
1.  **Core:** HTML5, Vanilla JavaScript (ES6+), Custom CSS.
2.  **Forbidden Frameworks:** NO Vue.js, React, Alpine, or jQuery. State management is handled via a Vanilla JS `state` object with DOM re-rendering.
3.  **Dependencies (CDN - Bootstrap 5.3.3):**
    * `bootstrap-reboot.min.css` - CSS reset
    * `bootstrap-grid.min.css` - Grid system for the canvas
    * `bootstrap.min.css` - Full Bootstrap for Editor Panel UI components
    * `bootstrap-icons` - Icon library
    * `bootstrap.bundle.min.js` - For modal functionality
4.  **Layout Architecture:**
    * Fixed **Header** with global controls and breakpoint badge
    * Scrollable **Canvas Area** for the playground grid
    * Collapsible **Editor Panel** (bottom sheet) for editing properties
    * **Code Modal** for viewing/copying generated HTML

---

## Documentation Context (MCP Targets)
*Reference these Bootstrap 5.3 docs for implementation details:*

* **Grid System:** `https://getbootstrap.com/docs/5.3/layout/grid/`
* **Columns (Alignment/Reordering):** `https://getbootstrap.com/docs/5.3/layout/columns/`
* **Gutters:** `https://getbootstrap.com/docs/5.3/layout/gutters/`
* **Breakpoints:** `https://getbootstrap.com/docs/5.3/layout/breakpoints/`

---

## Feature Requirements

### 1. Global Playground Settings ✅
* **Container Toggle:** A switch to toggle the main wrapper between `.container` (responsive fixed width) and `.container-fluid` (100% width).
* **"Ghost" Grid Overlay:** A toggleable background layer that visually displays the 12 columns in pink/red (using semitransparent backgrounds) so students can check alignment.
    * *Constraint:* The Ghost Grid respects the current Container setting (fluid vs fixed).
* **Live Breakpoint Badge:** A visual indicator showing the current Bootstrap breakpoint (XS, SM, MD, LG, XL, XXL) based on the browser's current width. Color-coded by breakpoint.

### 2. Row Management ✅
* **Add/Delete Rows:** Users can stack multiple rows with add/delete buttons.
* **Row Properties:**
    * **Gutters:** Dropdowns for `.gx-*` (horizontal) and `.gy-*` (vertical) ranging from 0–5.
    * **Vertical Alignment:** Options for `.align-items-*` (start, center, end).
    * **Horizontal Alignment:** Options for `.justify-content-*` (start, center, end, between, around, evenly).

### 3. Column Management ✅
* **Add/Delete Columns:** Users can add columns to a row (limit warning at 12).
* **Column Properties (The Core Learning Module):**
    * **Responsive Widths:** A matrix of dropdowns for **ALL** breakpoints (xs, sm, md, lg, xl, xxl).
        * *Options:* `col` (auto equal), `col-auto` (content), `col-1` to `col-12`, and inherit.
    * **Offsets:** Dropdowns for `.offset-*` logic at each breakpoint.
    * **Ordering:** Responsive dropdowns for `.order-*` classes at each breakpoint (e.g., `order-1`, `order-md-2`, etc.) to demonstrate visual reordering.

### 4. Code Generation ✅
* **Real-time Export:** A modal that displays the raw HTML of the current grid configuration.
* **Copy to Clipboard:** One-click copy functionality with visual feedback.
* The code output follows Bootstrap conventions:
    ```html
    <div class="container text-center">
      <div class="row justify-content-center g-3">
        <div class="col-12 col-md-6">...</div>
        <div class="col-6 col-md-3">...</div>
      </div>
    </div>
    ```

---

## Implementation Phases (Vibe Coding Flow)

### Phase 1: The Foundation ✅
1.  Set up the HTML skeleton.
2.  Import CDNs.
3.  Create the `state` object in `script.js` to hold the grid data structure (e.g., `state = { containerType: 'container', rows: [] }`).
4.  Implement the `updateBreakpointBadge()` function using `window.innerWidth`.

### Phase 2: The Renderer (Vanilla JS) ✅
1.  Create a function `renderGrid()` that:
    * Clears the canvas DOM.
    * Loops through `state.rows`.
    * Creates DOM elements (`div.row`, `div.col`).
    * Applies classes based on the state.
2.  Ensure every generated column has a `click` event listener that opens the **Editor Panel**.

### Phase 3: The Ghost Grid & Settings ✅
1.  Implement the `.grid-overlay` CSS. It should use `pointer-events: none` and `z-index: 0`.
2.  Ensure the overlay dynamically adds/removes the `.container-fluid` class based on the user's choice.

### Phase 4: The Editor Panel (UI) ✅
1.  Build a "Bottom Sheet" using standard Bootstrap UI components (Cards, Forms).
2.  **Logic:** When a user clicks a Column in the canvas:
    * Set `activeElement` in state.
    * Populate the Editor Panel inputs with that column's current classes.
    * On input change -> Update State -> Trigger `renderGrid()`.

### Phase 5: Advanced Props (Gutters & Alignment) ✅
1.  Add specific controls for Row-level settings.
2.  Row editor includes gutter controls (gx-*, gy-*) and alignment controls (align-items-*, justify-content-*).

---

## QA & Refinement Prompts
* "Ensure that when I select 'Auto' for a width, it applies the class `.col` or `.col-{bp}-auto` correctly."
* "Make sure the visual style of the 'blocks' in the playground is distinct (add borders/backgrounds) so the user can see the whitespace created by Gutters."
* "The code export block should use syntax highlighting or simple pre-formatted text for readability."

---

## UI/UX Design Guidelines

### Button Visibility & Labels
* **Use descriptive text labels** on action buttons instead of icons-only. For example:
  - ✅ "Add Column" instead of "+ Col"
  - ✅ "Edit Row" instead of just a pencil icon
  - ✅ "Delete" with a clear icon
* **Ensure sufficient contrast** between button backgrounds and text.
* **Position controls clearly** - row controls should be visible and accessible.

### Ghost Grid Alignment
* The Ghost Grid **must use Bootstrap's default gutter** (1.5rem / 24px total) to properly align with content columns.
* When the user hasn't modified gutter settings (gx-* or gy-*), the ghost grid and content columns should align perfectly.
* The ghost grid uses Bootstrap's own `.container`, `.row`, and `.col` classes to ensure consistent spacing.
* **Important:** Don't override Bootstrap's gutter CSS variables or margin/padding on the ghost grid elements.

---

## How to Use the Playground

1. **Open `index.html`** in a web browser.
2. **Add Rows:** Click the green "Add Row" button to create grid rows.
3. **Add Columns:** Use the "+ Col" button on each row to add columns.
4. **Edit Properties:** 
   - Click a column to open the editor panel and adjust responsive widths, offsets, and order.
   - Click the pencil icon on a row to edit gutter and alignment settings.
5. **Toggle Ghost Grid:** Enable to see the 12-column grid overlay.
6. **Switch Container Type:** Toggle between `.container` and `.container-fluid`.
7. **View Code:** Click "View Code" to see and copy the generated HTML.
8. **Resize Window:** Watch the breakpoint badge change color based on viewport width.

---

## State Structure Reference

```javascript
state = {
    containerType: 'container' | 'container-fluid',
    ghostGridVisible: boolean,
    activeElement: { type: 'row'|'col', rowIndex, colIndex? } | null,
    rows: [
        {
            id: string,
            gutterX: '' | '0'-'5',
            gutterY: '' | '0'-'5',
            alignItems: '' | 'align-items-start' | 'align-items-center' | 'align-items-end',
            justifyContent: '' | 'justify-content-*',
            columns: [
                {
                    id: string,
                    widths: { xs, sm, md, lg, xl, xxl },
                    offsets: { xs, sm, md, lg, xl, xxl },
                    orders: { xs, sm, md, lg, xl, xxl }  // Responsive order classes
                }
            ]
        }
    ]
}
```

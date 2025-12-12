/**
 * Bootstrap 5.3 Grid Mastery Playground
 * Vanilla JavaScript Application
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    containerType: 'container', // 'container' or 'container-fluid'
    ghostGridVisible: false,
    activeElement: null, // { type: 'row' | 'col', rowIndex: number, colIndex?: number }
    rows: []
};

// Default column template
const createDefaultColumn = (colorIndex) => ({
    id: generateId(),
    colorIndex: colorIndex !== undefined ? colorIndex : Math.floor(Math.random() * 8),
    height: '',           // Custom height (e.g., '50px', '100px', '150px', '200px')
    widths: {
        xs: '',         // Empty = no col class (allows removing column below XS breakpoint)
        sm: '',         // Empty = inherit from XS
        md: '',         // Empty = inherit from SM
        lg: '',         // Empty = inherit from MD
        xl: '',         // Empty = inherit from LG
        xxl: ''         // Empty = inherit from XL
    },
    offsets: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
        xxl: ''
    },
    orders: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
        xxl: ''
    }
});

// Default row template
const createDefaultRow = () => ({
    id: generateId(),
    gutterX: '',        // gx-0 to gx-5
    gutterY: '',        // gy-0 to gy-5
    alignItems: '',     // align-items-start, center, end
    justifyContent: '', // justify-content-start, center, end, between, around, evenly
    columns: [createDefaultColumn(0), createDefaultColumn(1)]
});

// Generate unique ID
function generateId() {
    return 'el_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// BREAKPOINT DETECTION
// ============================================

const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
};

function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
}

// Track the previous breakpoint to detect changes
let previousBreakpoint = null;

function updateBreakpointBadge() {
    const badge = document.getElementById('breakpointBadge');
    const bp = getCurrentBreakpoint();

    // Check if breakpoint changed
    const breakpointChanged = previousBreakpoint !== null && previousBreakpoint !== bp;

    // Remove all breakpoint classes
    badge.classList.remove('bp-xs', 'bp-sm', 'bp-md', 'bp-lg', 'bp-xl', 'bp-xxl');

    // Add current breakpoint class and text
    badge.classList.add(`bp-${bp}`);
    badge.textContent = bp.toUpperCase();

    // If breakpoint changed, trigger visual effects
    if (breakpointChanged) {
        triggerBreakpointTransition();

        // Add bounce animation to badge
        badge.classList.remove('breakpoint-badge-bounce');
        // Force reflow to restart animation
        void badge.offsetWidth;
        badge.classList.add('breakpoint-badge-bounce');
    }

    previousBreakpoint = bp;
}

// Trigger visual effect on all columns when breakpoint changes
function triggerBreakpointTransition() {
    const columns = document.querySelectorAll('.playground-col');

    columns.forEach(col => {
        col.classList.remove('breakpoint-transition');
        // Force reflow to restart animation
        void col.offsetWidth;
        col.classList.add('breakpoint-transition');

        // Remove class after animation completes
        setTimeout(() => {
            col.classList.remove('breakpoint-transition');
        }, 400);
    });
}

// ============================================
// RENDERER
// ============================================

function renderGrid() {
    const playground = document.getElementById('playground');
    playground.innerHTML = '';

    // Apply container type
    playground.className = `${state.containerType} playground-container`;

    // If no rows, show empty state
    if (state.rows.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-5 text-muted';
        emptyState.innerHTML = `
            <i class="bi bi-grid-3x3-gap display-4 d-block mb-3"></i>
            <p>Click "Add Row" to start building your grid</p>
        `;
        playground.appendChild(emptyState);
        return;
    }

    // Render each row
    state.rows.forEach((row, rowIndex) => {
        const rowEl = createRowElement(row, rowIndex);
        playground.appendChild(rowEl);
    });

    // Update code preview if modal is open
    updateCodePreview();
}

function createRowElement(row, rowIndex) {
    const rowEl = document.createElement('div');

    // Build row classes
    const rowClasses = ['row', 'playground-row'];

    if (row.gutterX) rowClasses.push(`gx-${row.gutterX}`);
    if (row.gutterY) rowClasses.push(`gy-${row.gutterY}`);
    if (row.alignItems) rowClasses.push(row.alignItems);
    if (row.justifyContent) rowClasses.push(row.justifyContent);

    // Check if this row is active
    if (state.activeElement?.type === 'row' && state.activeElement?.rowIndex === rowIndex) {
        rowClasses.push('active');
    }

    rowEl.className = rowClasses.join(' ');
    rowEl.dataset.rowIndex = rowIndex;

    // Row label
    const label = document.createElement('span');
    label.className = 'row-label';
    label.textContent = `.row${row.gutterX ? ` .gx-${row.gutterX}` : ''}${row.gutterY ? ` .gy-${row.gutterY}` : ''}`;
    rowEl.appendChild(label);

    // Row controls
    const controls = document.createElement('div');
    controls.className = 'row-controls';
    controls.innerHTML = `
        <button class="btn btn-sm btn-success add-col-btn" title="Add Column">
            <i class="bi bi-plus-lg"></i> Add Column
        </button>
        <button class="btn btn-sm btn-primary edit-row-btn" title="Edit Row Settings">
            <i class="bi bi-sliders"></i> Edit Row
        </button>
        <button class="btn btn-sm btn-danger delete-row-btn" title="Delete Row">
            <i class="bi bi-trash"></i> Delete
        </button>
    `;
    rowEl.appendChild(controls);

    // Add column click handler
    controls.querySelector('.add-col-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addColumn(rowIndex);
    });

    // Edit row handler
    controls.querySelector('.edit-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        selectRow(rowIndex);
    });

    // Delete row handler
    controls.querySelector('.delete-row-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteRow(rowIndex);
    });

    // Render columns
    if (row.columns.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-row-message';
        emptyMsg.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add columns to this row';
        emptyMsg.addEventListener('click', () => addColumn(rowIndex));
        rowEl.appendChild(emptyMsg);
    } else {
        row.columns.forEach((col, colIndex) => {
            const colEl = createColumnElement(col, rowIndex, colIndex);
            rowEl.appendChild(colEl);
        });
    }

    return rowEl;
}

function createColumnElement(col, rowIndex, colIndex) {
    const colEl = document.createElement('div');

    // Build column classes
    const colClasses = ['playground-col'];

    // Add responsive width classes
    Object.entries(col.widths).forEach(([bp, value]) => {
        if (value) {
            if (bp === 'xs') {
                colClasses.push(value);
            } else {
                // Convert 'col' to 'col-{bp}' and 'col-X' to 'col-{bp}-X'
                if (value === 'col') {
                    colClasses.push(`col-${bp}`);
                } else if (value.startsWith('col-')) {
                    const size = value.replace('col-', '');
                    colClasses.push(`col-${bp}-${size}`);
                }
            }
        }
    });


    // Add offset classes
    Object.entries(col.offsets).forEach(([bp, value]) => {
        if (value) {
            if (bp === 'xs') {
                colClasses.push(`offset-${value}`);
            } else {
                colClasses.push(`offset-${bp}-${value}`);
            }
        }
    });

    // Add order class
    if (col.orders) {
        Object.entries(col.orders).forEach(([bp, value]) => {
            if (value) {
                if (bp === 'xs') {
                    colClasses.push(`order-${value}`);
                } else {
                    colClasses.push(`order-${bp}-${value}`);
                }
            }
        });
    } else if (col.order) {
        // Backward compatibility for old state
        colClasses.push(`order-${col.order}`);
    }

    // Check if active
    if (state.activeElement?.type === 'col' &&
        state.activeElement?.rowIndex === rowIndex &&
        state.activeElement?.colIndex === colIndex) {
        colClasses.push('active');
    }

    colEl.className = colClasses.join(' ');
    colEl.dataset.rowIndex = rowIndex;
    colEl.dataset.colIndex = colIndex;
    colEl.dataset.colorIndex = col.colorIndex !== undefined ? col.colorIndex : (colIndex % 8);

    // Add color class based on colorIndex
    colEl.classList.add(`col-color-${col.colorIndex !== undefined ? col.colorIndex : (colIndex % 8)}`);

    // Make column draggable
    colEl.draggable = true;

    // Column inner content
    const inner = document.createElement('div');
    inner.className = 'col-inner';

    // Apply custom height if set
    if (col.height) {
        inner.style.minHeight = col.height;
    }

    // Column label showing the effective classes
    const visibleClasses = colClasses.filter(c => c !== 'playground-col' && c !== 'active' && !c.startsWith('col-color-'));
    inner.innerHTML = `
        <span class="col-label">${visibleClasses[0] || '(no col class)'}</span>
        <span class="col-classes">${visibleClasses.slice(1).join(' ') || ''}</span>
        <button class="col-delete" title="Delete column"><i class="bi bi-x"></i></button>
    `;

    colEl.appendChild(inner);

    // Click handler to select column
    inner.addEventListener('click', (e) => {
        if (e.target.closest('.col-delete')) return;
        selectColumn(rowIndex, colIndex);
    });

    // Delete handler
    inner.querySelector('.col-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteColumn(rowIndex, colIndex);
    });

    // Drag and drop event listeners
    colEl.addEventListener('dragstart', handleDragStart);
    colEl.addEventListener('dragend', handleDragEnd);
    colEl.addEventListener('dragover', handleDragOver);
    colEl.addEventListener('dragleave', handleDragLeave);
    colEl.addEventListener('drop', handleDrop);

    return colEl;
}

// ============================================
// STATE MUTATIONS
// ============================================

function addRow() {
    state.rows.push(createDefaultRow());
    renderGrid();
}

function deleteRow(rowIndex) {
    state.rows.splice(rowIndex, 1);

    // Clear active element if it was in this row
    if (state.activeElement?.rowIndex === rowIndex) {
        state.activeElement = null;
        closeEditorPanel();
    } else if (state.activeElement?.rowIndex > rowIndex) {
        state.activeElement.rowIndex--;
    }

    renderGrid();
}

function addColumn(rowIndex) {
    const row = state.rows[rowIndex];

    // Check column limit
    const totalCols = row.columns.length;
    if (totalCols >= 12) {
        alert('Warning: You already have 12 columns. Bootstrap grid has 12 column slots.');
        return;
    }

    // Assign next color index (cycle through 0-7)
    const nextColorIndex = totalCols % 8;
    row.columns.push(createDefaultColumn(nextColorIndex));
    renderGrid();
}

function deleteColumn(rowIndex, colIndex) {
    state.rows[rowIndex].columns.splice(colIndex, 1);

    // Clear active element if it was this column
    if (state.activeElement?.type === 'col' &&
        state.activeElement?.rowIndex === rowIndex &&
        state.activeElement?.colIndex === colIndex) {
        state.activeElement = null;
        closeEditorPanel();
    }

    renderGrid();
}

function selectRow(rowIndex) {
    state.activeElement = { type: 'row', rowIndex };
    renderGrid();
    openEditorPanel();
    renderRowEditor(rowIndex);
}

function selectColumn(rowIndex, colIndex) {
    state.activeElement = { type: 'col', rowIndex, colIndex };
    renderGrid();
    openEditorPanel();
    renderColumnEditor(rowIndex, colIndex);
}

// ============================================
// EDITOR PANEL
// ============================================

function openEditorPanel() {
    document.getElementById('editorPanel').classList.add('open');
}

function closeEditorPanel() {
    document.getElementById('editorPanel').classList.remove('open');
    state.activeElement = null;
    renderGrid();
}

function renderRowEditor(rowIndex) {
    const row = state.rows[rowIndex];
    const container = document.getElementById('editorContent');
    document.getElementById('editorTitle').textContent = `Editing Row ${rowIndex + 1}`;

    container.innerHTML = `
        <div class="editor-section">
            <div class="editor-section-title">Gutters</div>
            <div class="inline-controls">
                <div class="form-group">
                    <label for="gutterX">Horizontal (gx-*)</label>
                    <select class="form-select form-select-sm" id="gutterX">
                        <option value="">Default</option>
                        <option value="0">gx-0 (None)</option>
                        <option value="1">gx-1</option>
                        <option value="2">gx-2</option>
                        <option value="3">gx-3</option>
                        <option value="4">gx-4</option>
                        <option value="5">gx-5</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="gutterY">Vertical (gy-*)</label>
                    <select class="form-select form-select-sm" id="gutterY">
                        <option value="">Default</option>
                        <option value="0">gy-0 (None)</option>
                        <option value="1">gy-1</option>
                        <option value="2">gy-2</option>
                        <option value="3">gy-3</option>
                        <option value="4">gy-4</option>
                        <option value="5">gy-5</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="editor-section">
            <div class="editor-section-title">Alignment</div>
            <div class="inline-controls">
                <div class="form-group">
                    <label for="alignItems">Vertical (align-items-*)</label>
                    <select class="form-select form-select-sm" id="alignItems">
                        <option value="">Default (stretch)</option>
                        <option value="align-items-start">Start (top)</option>
                        <option value="align-items-center">Center</option>
                        <option value="align-items-end">End (bottom)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="justifyContent">Horizontal (justify-content-*)</label>
                    <select class="form-select form-select-sm" id="justifyContent">
                        <option value="">Default (start)</option>
                        <option value="justify-content-start">Start</option>
                        <option value="justify-content-center">Center</option>
                        <option value="justify-content-end">End</option>
                        <option value="justify-content-between">Space Between</option>
                        <option value="justify-content-around">Space Around</option>
                        <option value="justify-content-evenly">Space Evenly</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    // Set current values
    document.getElementById('gutterX').value = row.gutterX;
    document.getElementById('gutterY').value = row.gutterY;
    document.getElementById('alignItems').value = row.alignItems;
    document.getElementById('justifyContent').value = row.justifyContent;

    // Event listeners
    document.getElementById('gutterX').addEventListener('change', (e) => {
        row.gutterX = e.target.value;
        renderGrid();
    });

    document.getElementById('gutterY').addEventListener('change', (e) => {
        row.gutterY = e.target.value;
        renderGrid();
    });

    document.getElementById('alignItems').addEventListener('change', (e) => {
        row.alignItems = e.target.value;
        renderGrid();
    });

    document.getElementById('justifyContent').addEventListener('change', (e) => {
        row.justifyContent = e.target.value;
        renderGrid();
    });
}

function renderColumnEditor(rowIndex, colIndex) {
    const col = state.rows[rowIndex].columns[colIndex];
    const container = document.getElementById('editorContent');
    document.getElementById('editorTitle').textContent = `Editing Column ${colIndex + 1} in Row ${rowIndex + 1}`;

    // Generate width options for XS (with "None" option)
    const widthOptionsXS = `
        <option value="">None</option>
        <option value="col">Auto (equal)</option>
        <option value="col-auto">Auto (content)</option>
        <option value="col-1">1</option>
        <option value="col-2">2</option>
        <option value="col-3">3</option>
        <option value="col-4">4</option>
        <option value="col-5">5</option>
        <option value="col-6">6</option>
        <option value="col-7">7</option>
        <option value="col-8">8</option>
        <option value="col-9">9</option>
        <option value="col-10">10</option>
        <option value="col-11">11</option>
        <option value="col-12">12</option>
    `;

    // Generate width options for other breakpoints (with "Inherit" option)
    const widthOptions = `
        <option value="">Inherit</option>
        <option value="col">Auto (equal)</option>
        <option value="col-auto">Auto (content)</option>
        <option value="col-1">1</option>
        <option value="col-2">2</option>
        <option value="col-3">3</option>
        <option value="col-4">4</option>
        <option value="col-5">5</option>
        <option value="col-6">6</option>
        <option value="col-7">7</option>
        <option value="col-8">8</option>
        <option value="col-9">9</option>
        <option value="col-10">10</option>
        <option value="col-11">11</option>
        <option value="col-12">12</option>
    `;

    // Generate offset options
    const offsetOptions = `
        <option value="">None</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
    `;

    // Generate order options
    const orderOptions = `
        <option value="">Default</option>
        <option value="first">First</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="last">Last</option>
    `;

    container.innerHTML = `
        <div class="editor-section">
            <div class="editor-section-title">Responsive Widths (col-*)</div>
            <div class="breakpoint-grid">
                <div class="breakpoint-item">
                    <label>XS<br><small>&lt;576px</small></label>
                    <select class="form-select form-select-sm" data-bp="xs" data-prop="widths">${widthOptionsXS}</select>
                </div>
                <div class="breakpoint-item">
                    <label>SM<br><small>≥576px</small></label>
                    <select class="form-select form-select-sm" data-bp="sm" data-prop="widths">${widthOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>MD<br><small>≥768px</small></label>
                    <select class="form-select form-select-sm" data-bp="md" data-prop="widths">${widthOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>LG<br><small>≥992px</small></label>
                    <select class="form-select form-select-sm" data-bp="lg" data-prop="widths">${widthOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XL<br><small>≥1200px</small></label>
                    <select class="form-select form-select-sm" data-bp="xl" data-prop="widths">${widthOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XXL<br><small>≥1400px</small></label>
                    <select class="form-select form-select-sm" data-bp="xxl" data-prop="widths">${widthOptions}</select>
                </div>
            </div>
        </div>
        
        <div class="editor-section">
            <div class="editor-section-title">Offsets (offset-*)</div>
            <div class="breakpoint-grid">
                <div class="breakpoint-item">
                    <label>XS</label>
                    <select class="form-select form-select-sm" data-bp="xs" data-prop="offsets">${offsetOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>SM</label>
                    <select class="form-select form-select-sm" data-bp="sm" data-prop="offsets">${offsetOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>MD</label>
                    <select class="form-select form-select-sm" data-bp="md" data-prop="offsets">${offsetOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>LG</label>
                    <select class="form-select form-select-sm" data-bp="lg" data-prop="offsets">${offsetOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XL</label>
                    <select class="form-select form-select-sm" data-bp="xl" data-prop="offsets">${offsetOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XXL</label>
                    <select class="form-select form-select-sm" data-bp="xxl" data-prop="offsets">${offsetOptions}</select>
                </div>
            </div>
        </div>
        
        <div class="editor-section">
            <div class="editor-section-title">Order (order-*, order-md-*, etc.)</div>
            <div class="breakpoint-grid">
                <div class="breakpoint-item">
                    <label>XS</label>
                    <select class="form-select form-select-sm" data-bp="xs" data-prop="orders">${orderOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>SM</label>
                    <select class="form-select form-select-sm" data-bp="sm" data-prop="orders">${orderOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>MD</label>
                    <select class="form-select form-select-sm" data-bp="md" data-prop="orders">${orderOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>LG</label>
                    <select class="form-select form-select-sm" data-bp="lg" data-prop="orders">${orderOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XL</label>
                    <select class="form-select form-select-sm" data-bp="xl" data-prop="orders">${orderOptions}</select>
                </div>
                <div class="breakpoint-item">
                    <label>XXL</label>
                    <select class="form-select form-select-sm" data-bp="xxl" data-prop="orders">${orderOptions}</select>
                </div>
            </div>
        </div>
        
        <div class="editor-section">
            <div class="editor-section-title">Column Height (for testing align-items on the row settings)</div>
            <div class="inline-controls">
                <div class="form-group">
                    <label for="colHeight">Height</label>
                    <select class="form-select form-select-sm" id="colHeight">
                        <option value="">Default</option>
                        <option value="50px">50px</option>
                        <option value="80px">80px</option>
                        <option value="100px">100px</option>
                        <option value="120px">120px</option>
                        <option value="150px">150px</option>
                        <option value="200px">200px</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    // Set current values for height
    document.getElementById('colHeight').value = col.height || '';
    document.getElementById('colHeight').addEventListener('change', (e) => {
        col.height = e.target.value;
        renderGrid();
    });

    // Set current values
    container.querySelectorAll('select[data-bp]').forEach(select => {
        const bp = select.dataset.bp;
        const prop = select.dataset.prop;
        select.value = col[prop][bp] || '';

        select.addEventListener('change', (e) => {
            col[prop][bp] = e.target.value;
            renderGrid();
        });
    });
}

// ============================================
// CODE GENERATION
// ============================================

function generateCode() {
    const indent = '  ';
    let code = '';

    code += `<div class="${state.containerType}">\n`;

    state.rows.forEach(row => {
        // Build row classes
        const rowClasses = ['row'];
        if (row.gutterX) rowClasses.push(`gx-${row.gutterX}`);
        if (row.gutterY) rowClasses.push(`gy-${row.gutterY}`);
        if (row.alignItems) rowClasses.push(row.alignItems);
        if (row.justifyContent) rowClasses.push(row.justifyContent);

        code += `${indent}<div class="${rowClasses.join(' ')}">\n`;

        row.columns.forEach(col => {
            // Build column classes
            const colClasses = [];

            // Widths
            Object.entries(col.widths).forEach(([bp, value]) => {
                if (value) {
                    if (bp === 'xs') {
                        colClasses.push(value);
                    } else {
                        if (value === 'col') {
                            colClasses.push(`col-${bp}`);
                        } else if (value === 'col-auto') {
                            colClasses.push(`col-${bp}-auto`);
                        } else if (value.startsWith('col-')) {
                            const size = value.replace('col-', '');
                            colClasses.push(`col-${bp}-${size}`);
                        }
                    }
                }
            });


            // Offsets
            Object.entries(col.offsets).forEach(([bp, value]) => {
                if (value) {
                    if (bp === 'xs') {
                        colClasses.push(`offset-${value}`);
                    } else {
                        colClasses.push(`offset-${bp}-${value}`);
                    }
                }
            });

            // Orders (responsive)
            if (col.orders) {
                Object.entries(col.orders).forEach(([bp, value]) => {
                    if (value) {
                        if (bp === 'xs') {
                            colClasses.push(`order-${value}`);
                        } else {
                            colClasses.push(`order-${bp}-${value}`);
                        }
                    }
                });
            } else if (col.order) {
                // Backward compatibility
                colClasses.push(`order-${col.order}`);
            }

            // Generate the column div with or without class attribute
            const classAttr = colClasses.length > 0 ? ` class="${colClasses.join(' ')}"` : '';
            code += `${indent}${indent}<div${classAttr}>...</div>\n`;
        });

        code += `${indent}</div>\n`;
    });

    code += `</div>`;

    return code;
}

function updateCodePreview() {
    const codeEl = document.getElementById('generatedCode');
    if (codeEl) {
        codeEl.textContent = generateCode();
    }
}

function showCodeModal() {
    updateCodePreview();
    const modal = new bootstrap.Modal(document.getElementById('codeModal'));
    modal.show();
}

function copyCode() {
    const code = generateCode();
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCodeBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-primary');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-primary');
        }, 2000);
    });
}

// ============================================
// GHOST GRID
// ============================================

function toggleGhostGrid(visible) {
    state.ghostGridVisible = visible;
    const ghostGrid = document.getElementById('ghostGrid');

    if (visible) {
        ghostGrid.classList.add('active');
    } else {
        ghostGrid.classList.remove('active');
    }

    updateGhostGridContainer();
}

function updateGhostGridContainer() {
    const ghostGrid = document.getElementById('ghostGrid');

    if (state.containerType === 'container-fluid') {
        ghostGrid.classList.remove('container');
        ghostGrid.classList.add('container-fluid');
    } else {
        ghostGrid.classList.remove('container-fluid');
        ghostGrid.classList.add('container');
    }
}

// ============================================
// CONTAINER TOGGLE
// ============================================

function toggleContainer(isFluid) {
    state.containerType = isFluid ? 'container-fluid' : 'container';
    document.getElementById('containerLabel').textContent = isFluid ? '.container-fluid' : '.container';
    updateGhostGridContainer();
    renderGrid();
}

// ============================================
// DRAG AND DROP HANDLERS
// ============================================

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = {
        rowIndex: parseInt(e.currentTarget.dataset.rowIndex),
        colIndex: parseInt(e.currentTarget.dataset.colIndex)
    };

    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');

    // Remove all drag-over classes from columns
    document.querySelectorAll('.playground-col').forEach(col => {
        col.classList.remove('drag-over');
    });

    // Remove all drag-over classes from rows
    document.querySelectorAll('.playground-row').forEach(row => {
        row.classList.remove('drag-over-row');
    });

    draggedElement = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    const targetCol = e.currentTarget;
    const targetRowIndex = parseInt(targetCol.dataset.rowIndex);

    if (targetCol.classList.contains('playground-col') && !targetCol.classList.contains('dragging')) {
        targetCol.classList.add('drag-over');

        // Add visual feedback to row if dragging between different rows
        if (draggedElement && draggedElement.rowIndex !== targetRowIndex) {
            const targetRow = targetCol.closest('.playground-row');
            if (targetRow) {
                targetRow.classList.add('drag-over-row');
            }
        }
    }

    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');

    // Remove row-level visual feedback
    const row = e.currentTarget.closest('.playground-row');
    if (row) {
        // Only remove if we're truly leaving the row, not just moving to another column in same row
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !row.contains(relatedTarget)) {
            row.classList.remove('drag-over-row');
        }
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.preventDefault();

    const targetRowIndex = parseInt(e.currentTarget.dataset.rowIndex);
    const targetColIndex = parseInt(e.currentTarget.dataset.colIndex);

    // Don't drop on itself
    if (draggedElement &&
        (draggedElement.rowIndex !== targetRowIndex || draggedElement.colIndex !== targetColIndex)) {

        const sourceRow = state.rows[draggedElement.rowIndex];
        const targetRow = state.rows[targetRowIndex];
        const draggedCol = sourceRow.columns[draggedElement.colIndex];

        if (draggedElement.rowIndex === targetRowIndex) {
            // Same row - reorder columns
            // Remove from old position
            sourceRow.columns.splice(draggedElement.colIndex, 1);

            // Insert at new position
            const newIndex = draggedElement.colIndex < targetColIndex ? targetColIndex - 1 : targetColIndex;
            sourceRow.columns.splice(newIndex, 0, draggedCol);

            // Update active element if needed
            if (state.activeElement?.type === 'col' && state.activeElement?.rowIndex === targetRowIndex) {
                if (state.activeElement.colIndex === draggedElement.colIndex) {
                    state.activeElement.colIndex = newIndex;
                }
            }
        } else {
            // Different row - move column to new row
            // Check if target row has room (max 12 columns)
            if (targetRow.columns.length >= 12) {
                alert('Target row is full (12 columns maximum).');
                e.currentTarget.classList.remove('drag-over');
                return false;
            }

            // Remove from source row
            sourceRow.columns.splice(draggedElement.colIndex, 1);

            // Insert at target position
            targetRow.columns.splice(targetColIndex, 0, draggedCol);

            // Clear active element if it was the dragged column
            if (state.activeElement?.type === 'col' &&
                state.activeElement?.rowIndex === draggedElement.rowIndex &&
                state.activeElement?.colIndex === draggedElement.colIndex) {
                state.activeElement = null;
                closeEditorPanel();
            }
        }

        renderGrid();
    }

    e.currentTarget.classList.remove('drag-over');
    return false;
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Add Row Button
    document.getElementById('addRowBtn').addEventListener('click', addRow);

    // Container Toggle
    document.getElementById('containerToggle').addEventListener('change', (e) => {
        toggleContainer(e.target.checked);
    });

    // Ghost Grid Toggle
    document.getElementById('ghostGridToggle').addEventListener('change', (e) => {
        toggleGhostGrid(e.target.checked);
    });

    // View Code Button
    document.getElementById('viewCodeBtn').addEventListener('click', showCodeModal);

    // Copy Code Button
    document.getElementById('copyCodeBtn').addEventListener('click', copyCode);

    // Close Editor Panel
    document.getElementById('closeEditorBtn').addEventListener('click', closeEditorPanel);

    // Editor Panel Header Click (toggle)
    document.querySelector('.editor-panel-header').addEventListener('click', (e) => {
        if (e.target.closest('#closeEditorBtn')) return;
        const panel = document.getElementById('editorPanel');
        if (panel.classList.contains('open')) {
            closeEditorPanel();
        }
    });

    // Window resize for breakpoint badge
    window.addEventListener('resize', updateBreakpointBadge);

    // Click outside to deselect
    document.getElementById('playground').addEventListener('click', (e) => {
        if (e.target.id === 'playground' || e.target.closest('.text-center.py-5')) {
            if (state.activeElement) {
                state.activeElement = null;
                closeEditorPanel();
                renderGrid();
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initEventListeners();
    updateBreakpointBadge();

    // Add initial row for demonstration
    state.rows.push(createDefaultRow());

    renderGrid();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);


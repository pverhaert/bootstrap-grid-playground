# Bootstrap 5.3 Grid Playground

An interactive visual tool for learning and experimenting with the Bootstrap 5.3 grid system.

![Bootstrap Grid Playground](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Visual Grid Builder** - Create rows and columns with a simple click
- **Responsive Breakpoints** - Configure column widths for all 6 Bootstrap breakpoints (xs, sm, md, lg, xl, xxl)
- **Ghost Grid Overlay** - See the 12-column grid overlay to understand column alignment
- **Live Preview** - See changes instantly as you modify settings
- **Code Generation** - Export clean Bootstrap HTML code
- **Gutter Controls** - Adjust horizontal and vertical gutters
- **Offset & Order** - Full support for column offsets and ordering
- **Alignment Options** - Control row alignment with align-items and justify-content

## Demo

Visit the live demo: [Bootstrap Grid Playground](https://itf-bs5-playground.netlify.app)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/pverhaert/bootstrap-grid-playground.git
   cd bootstrap-grid-playground
   ```

2. Open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npm install -g live-server
   live-server
   ```

3. Visit `http://localhost:8000`

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pverhaert/bootstrap-grid-playground)

Or manually:
1. Push this repository to GitHub
2. Connect your GitHub repo to Netlify
3. Deploy with default settings (no build command needed)

## Project Structure

```
bootstrap-grid-playground/
├── index.html      # Main HTML file
├── styles.css      # Custom styles
├── script.js       # Application logic
├── netlify.toml    # Netlify configuration
├── AGENTS.md       # AI agent instructions
└── README.md       # This file
```

## How to Use

1. **Add a Row** - Click "Add Row" to create a new row
2. **Add Columns** - Click "Add Column" or the empty row to add columns
3. **Edit Columns** - Click on any column to edit its responsive settings
4. **Edit Rows** - Click "Edit Row" to modify gutter and alignment settings
5. **Toggle Ghost Grid** - Enable to see the 12-column reference grid
6. **View Code** - Click "View Code" to see and copy the generated HTML

## Understanding the Visual Elements

- **Pink Dashed Grid** - The ghost grid showing Bootstrap's 12 columns
- **Colored Blocks** - Your columns (different colors for visual distinction)
- **Dotted Outlines** - Shows actual column space including gutters
- **Dashed Border** - Row boundaries

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - The CSS framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon library


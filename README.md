# Better Regions for Python Interactive

A VS Code extension that highlights Python code regions with colored backgrounds and provides a tree view for easy navigation.

## Features

### Region Highlighting

Automatically highlights Python code regions using `# region` and `#endregion` comments:

```python
# region Setup
import numpy as np
import pandas as pd
# endregion

# region Data Processing
data = np.array([1, 2, 3, 4, 5])
processed = data * 2
# endregion

# region Output
print(processed)
# endregion
```

- **Colored backgrounds** - Each region gets a unique color based on its name
- **Nested regions** - Supports hierarchical region structures
- **Auto-detection** - Regions are highlighted automatically when you open or edit Python files

### Region Explorer

A dedicated tree view in the Explorer panel showing all regions in your Python files:

- **Hierarchical view** - Displays nested regions as expandable tree nodes
- **Quick navigation** - Click on any region to reveal it in the editor
- **Line range info** - Hover over a region to see its line numbers
- **Refresh button** - Manually refresh the region list

### Run Region in Python Interactive

Execute any region directly in the Python Interactive window:

1. Right-click on a region in the Region Explorer
2. Select "Run in Python Interactive"
3. The region's code is sent to the Jupyter/Python Interactive window

**Note:** Requires the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension with Jupyter support.

### Reveal in Editor

Quickly navigate to any region by clicking "Reveal in Editor" from the context menu.

## Configuration

Customize the region highlighting behavior through VS Code settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `regionBackground.enabled` | `true` | Enable or disable region background highlighting |
| `regionBackground.highlightOnlyLastRegion` | `false` | Only highlight the region containing the cursor |
| `regionBackground.opacity` | `0.15` | Background opacity (0.0 - 1.0) |
| `regionBackground.saturation` | `0.6` | Color saturation (0.0 - 1.0) |
| `regionBackground.lightness` | `0.85` | Base lightness (0.0 - 1.0) |

## Requirements

- VS Code version 1.74.0 or higher
- Python language support (for syntax highlighting)
- Jupyter extension (optional, for "Run in Python Interactive" feature)

## Usage

### Creating Regions

Add `# region` and `#endregion` comments to define code regions:

```python
# region My Region Name
# Your code here
# endregion
```

### Nested Regions

Regions can be nested within other regions:

```python
# region Outer Region
x = 1

# region Inner Region
y = 2
# endregion

z = 3
# endregion
```

### Keyboard Shortcut

Add a keyboard shortcut for quick region refresh:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Search for "Preferences: Open Keyboard Shortcuts"
3. Search for "Refresh Regions"
4. Assign your preferred keybinding

## Commands

| Command | Description |
|---------|-------------|
| `regionExplorer.refresh` | Refresh the region list |
| `regionExplorer.runInInteractive` | Run selected region in Python Interactive |
| `regionExplorer.revealInEditor` | Navigate to selected region in editor |

## License

MIT License - see [LICENSE](LICENSE) for details.

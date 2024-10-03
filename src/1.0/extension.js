const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const WorkspaceManager = global.workspace_manager;

let currentTilingMode = {}; // Track per-workspace tiling modes

function enable() {
    // Initialize tiling mode for each workspace
    for (let i = 0; i < WorkspaceManager.n_workspaces; i++) {
        currentTilingMode[i] = 'manual'; // Start with manual mode
    }
    
    // Listen for window creation events and adjust layout
    global.display.connect('window-created', onWindowCreated);
}

function disable() {
    // Cleanup when the extension is disabled
    global.display.disconnect('window-created', onWindowCreated);
}

function onWindowCreated(display, window) {
    let workspaceIndex = WorkspaceManager.get_active_workspace_index();
    
    // Check the tiling mode for the current workspace
    if (currentTilingMode[workspaceIndex] === 'auto') {
        autoTileWindows(workspaceIndex);
    }
}

function autoTileWindows(workspaceIndex) {
    let workspace = WorkspaceManager.get_workspace_by_index(workspaceIndex);
    let windows = workspace.list_windows();
    
    // Maximize first window, then tile others
    if (windows.length === 1) {
        windows[0].maximize(Meta.MaximizeFlags.BOTH);
    } else if (windows.length === 2) {
        tileTwoWindows(windows);
    } else if (windows.length === 3) {
        tileThreeWindows(windows);
    } else {
        // Continue dwindling for more windows
        tileMultipleWindows(windows);
    }
}

function tileTwoWindows(windows) {
    // Left half, right half
    windows[0].move_resize_frame(false, 0, 0, global.display.get_width() / 2, global.display.get_height());
    windows[1].move_resize_frame(false, global.display.get_width() / 2, 0, global.display.get_width() / 2, global.display.get_height());
}

function tileThreeWindows(windows) {
    // First on left half, next two on right top/bottom
    windows[0].move_resize_frame(false, 0, 0, global.display.get_width() / 2, global.display.get_height());
    windows[1].move_resize_frame(false, global.display.get_width() / 2, 0, global.display.get_width() / 2, global.display.get_height() / 2);
    windows[2].move_resize_frame(false, global.display.get_width() / 2, global.display.get_height() / 2, global.display.get_width() / 2, global.display.get_height() / 2);
}

function tileMultipleWindows(windows) {
    // Continue the dwindling logic for 4+ windows
    // Adjust the layout strategy as needed
}

function toggleTilingMode(workspaceIndex) {
    // Switch between manual and auto-tiling
    currentTilingMode[workspaceIndex] = currentTilingMode[workspaceIndex] === 'manual' ? 'auto' : 'manual';
}

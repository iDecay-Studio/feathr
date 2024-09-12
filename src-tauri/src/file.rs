use std::path::PathBuf;
use tauri::{AppHandle, Manager};

//https://github.com/tauri-apps/tauri/tree/dev/examples/file-associations
pub fn handle_file_associations(app: AppHandle, files: Vec<PathBuf>) {
  // -- Scope handling start --

  // This requires the `fs` tauri plugin and is required to make the plugin's frontend work:
  use tauri_plugin_fs::FsExt;
  let fs_scope = app.fs_scope();

  // This is for the `asset:` protocol to work:
  // let asset_protocol_scope = app.asset_protocol_scope();

  for file in &files {
    // This requires the `fs` plugin:
    let _ = fs_scope.allow_file(file);

    // This is for the `asset:` protocol:
    //let _ = asset_protocol_scope.allow_file(file);
  }

  // -- Scope handling end --

  //let files = files
  //  .into_iter()
  //  .map(|f| {
  //    let file = f.to_string_lossy().replace("\\\\", "\\"); // escape backslash
  //    format!("\"{file}\"",) // wrap in quotes for JS array
  //  })
  //  .collect::<Vec<_>>()
  //  .join(",");
  
  let webview = app.get_webview_window("main").unwrap();
  let _ = webview.eval(&format!("window.openedFiles = {:?}", files));
}
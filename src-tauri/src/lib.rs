#[cfg(any(target_os = "windows", target_os = "macos"))]
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(target_os = "windows")]
  tauri::Builder::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .setup(|app| {
      let handle = app.app_handle();
      handle.get_webview_window("main").unwrap();
      
      #[cfg(desktop)]
      //handle.plugin(tauri_plugin_updater::Builder::new().build())?;
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    
  #[cfg(not(target_os = "windows"))]
  tauri::Builder::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
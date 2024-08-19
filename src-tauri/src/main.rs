#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(any(target_os = "windows", target_os = "macos"))]
use tauri::Manager;

fn main() {
    #[cfg(target_os = "windows")]
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let handle = app.app_handle();
            handle.get_webview_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(not(target_os = "windows"))]
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

//#[cfg(not(any(target_os = "android", target_os = "ios")))]
//mod tray;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
mod file;

use tauri::Manager;
use std::path::PathBuf;
use sys_locale::get_locale;

struct ParaState{
    current_path:String,
    input_file_path:String,
    current_locale:String
}

#[tauri::command]
fn fetch_locale(state: tauri::State<ParaState>) -> String {
  state.current_locale.clone()
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
fn create_window(app: tauri::AppHandle) {
  tauri::WebviewWindowBuilder::new(&app, "main", tauri::WebviewUrl::default())
    .title("feathr.")
    .inner_size(640 as f64, 560 as f64)
    .min_inner_size(300 as f64, 300 as f64)
    .decorations(false)
    .transparent(true)
    .visible(false) //enabled by window-state plugin after restoring pos./size
    .build()
    .unwrap();
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub fn desktop() {
  let app = tauri::Builder::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .setup(|#[allow(unused_variables)] app| {
      let handle = app.handle();
      
      if let Some(window) = handle.get_webview_window("main") {
        window.show().unwrap();
        window.set_focus().unwrap();
      } else {
        create_window(handle.clone());
      
        //tray::create_tray(handle)?;
        handle.plugin(tauri_plugin_updater::Builder::new().build())?;
      }
      
      // -- file association start --
      #[cfg(any(target_os = "windows", target_os = "linux"))]
      {
        let mut files = Vec::new();

        // NOTICE: `args` may include URL protocol (`your-app-protocol://`)
        // or arguments (`--`) if your app supports them.
        // files may also be passed as `file://path/to/file`
        for maybe_file in std::env::args().skip(1) {
          // skip flags like -f or --flag
          if maybe_file.starts_with("-") {
            continue;
          }
        
          // handle `file://` path urls and skip other urls
          //if let Ok(url) = Url::parse(&maybe_file) {
          //  if let Ok(path) = url.to_file_path() {
          //    files.push(path);
          //  }
          //} else {
            files.push(PathBuf::from(maybe_file))
          //}
        }
        
        //println!("{:?}", files);
        file::handle_file_associations(handle.clone(), files);
      }
      // -- file association end --

      Ok(())
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application");
  
  #[cfg(not(any(target_os = "macos")))]
  app.run(|_app_handle, _event| {});
  
  //handle file associations on macos
  #[cfg(any(target_os = "macos"))]
  app.run(|_app_handle, event| match event {
    tauri::RunEvent::Opened { urls } => {
      let files = urls
        .into_iter()
        .filter_map(|url| url.to_file_path().ok())
        .collect::<Vec<_>>();

      file::handle_file_associations(_app_handle.clone(), files);
    }
    _ => {}
  });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[cfg(any(target_os = "android", target_os = "ios"))]
pub fn mobile() {
  let app = tauri::Builder::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
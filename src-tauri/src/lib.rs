#[cfg(desktop)]
mod tray;
mod file;

#[cfg(any(target_os = "windows", target_os = "macos"))]
use tauri::Manager;
#[cfg(any(target_os = "windows", target_os = "linux"))]
use std::path::PathBuf;

fn create_window(app: tauri::AppHandle) {
  tauri::WebviewWindowBuilder::new(&app, "main", tauri::WebviewUrl::default())
    .title("feathr.")
    .inner_size(640 as f64, 560 as f64)
    .min_inner_size(300 as f64, 300 as f64)
    .decorations(false)
    .transparent(true)
    .build()
    .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(target_os = "windows")]
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
        if window.is_visible().unwrap() {
          window.set_focus().unwrap();
        } else {
          window.show().unwrap();
          window.set_focus().unwrap();
        }
      } else {
        create_window(handle.clone());
      
        #[cfg(all(desktop))]
        tray::create_tray(handle)?;
        
        #[cfg(desktop)]
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
  
  #[cfg(not(any(target_os = "macos", target_os = "ios")))]
  app.run(|_app_handle, _event| {});
  
  //handle file associations on apple products
  #[cfg(any(target_os = "macos", target_os = "ios"))]
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
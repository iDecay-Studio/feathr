#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
  #[cfg(not(any(target_os = "android", target_os = "ios")))]
  feathr_lib::desktop();
  #[cfg(any(target_os = "android", target_os = "ios"))]
  feathr_lib::mobile();
}

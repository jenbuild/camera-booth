// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs::File;
use std::io::Write;

use base64::{engine::general_purpose, Engine as _};
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_captured_image(
    app_handle: tauri::AppHandle,
    image_data: String,
    timestamp: u64,
) -> Result<String, String> {
    let (metadata, encoded_image) = image_data
        .split_once(',')
        .ok_or_else(|| "Image data is not a valid data URL".to_string())?;
    if metadata != "data:image/jpeg;base64" {
        return Err("Image data must be a Base64-encoded JPEG".to_string());
    }

    let image_bytes = general_purpose::STANDARD
        .decode(encoded_image)
        .map_err(|error| format!("Failed to decode image data: {error}"))?;
    let desktop_path = app_handle
        .path()
        .desktop_dir()
        .map_err(|error| format!("Failed to get desktop directory: {error}"))?;
    let file_path = desktop_path.join(format!("IMG_{timestamp}.jpeg"));

    let mut file = File::create(&file_path)
        .map_err(|error| format!("Failed to create image file: {error}"))?;
    file.write_all(&image_bytes)
        .map_err(|error| format!("Failed to write image file: {error}"))?;

    Ok(file_path.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, save_captured_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

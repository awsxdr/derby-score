use std::{error::Error, path::PathBuf};

use log::info;
use uuid::Uuid;

pub struct LogoDataStore {
    folder_path: PathBuf,
}

impl LogoDataStore {
    pub fn new(folder_path: PathBuf) -> Result<Self, Box<dyn Error>> {
        if !folder_path.exists() {
            info!("Logo folder not found. Creating {}", folder_path.to_string_lossy().to_string());
            std::fs::create_dir_all(&folder_path)?;
        }

        info!("Logo data store created");
        Ok(Self { folder_path: folder_path })
    }
    
    pub fn exists(&self, image_id: Uuid) -> bool {
        self.get_image_path(image_id).exists()
    }

    pub fn store(&self, image_id: Uuid, data: &[u8]) -> std::io::Result<()> {
        let image_path = self.get_image_path(image_id);
        if image_path.exists() {
            std::fs::remove_file(&image_path)?;
        }
        std::fs::write(&image_path, data)?;

        Ok(())
    }

    pub fn fetch(&self, image_id: Uuid) -> std::io::Result<Vec<u8>> {
        let image_path = self.get_image_path(image_id);
        std::fs::read(image_path)
    }

    fn get_image_path(&self, image_id: Uuid) -> PathBuf {
        self.folder_path
            .join(image_id.as_hyphenated().to_string())
            .with_extension("png")
    }
}
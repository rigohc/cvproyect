import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { galleryPhotos, type GalleryPhoto } from "../../data/portfolio";
import "./ProfileGallery.css";

function GalleryItem({
  photo,
  featured,
  onOpen,
}: {
  photo: GalleryPhoto;
  featured?: boolean;
  onOpen: (photo: GalleryPhoto) => void;
}) {
  return (
    <button
      type="button"
      className={`gallery-card ${featured ? "gallery-card--featured" : ""}`}
      onClick={() => onOpen(photo)}
      aria-label={`Ver foto: ${photo.alt}`}
    >
      <img src={photo.src} alt={photo.alt} loading={featured ? "eager" : "lazy"} decoding="async" />
      <figcaption>
        <span>{photo.caption}</span>
        <em>{photo.year}</em>
      </figcaption>
    </button>
  );
}

export default function ProfileGallery() {
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);
  const [featured, ...rest] = galleryPhotos;

  return (
    <div className="profile-gallery">
      <GalleryItem photo={featured} featured onOpen={setLightbox} />
      <div className="gallery-grid">
        {rest.map((photo) => (
          <GalleryItem key={photo.id} photo={photo} onOpen={setLightbox} />
        ))}
      </div>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className="gallery-lightbox no-print"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
          >
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" className="gallery-lightbox-close" onClick={() => setLightbox(null)} aria-label="Cerrar">
              ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      
    </div>
  );
}

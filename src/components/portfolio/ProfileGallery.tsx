import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { galleryPhotos, type GalleryPhoto } from "../../data/portfolio";

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

      <style>{`
        .profile-gallery {
          display: grid;
          gap: 12px;
          margin-bottom: 28px;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .gallery-card {
          position: relative;
          margin: 0;
          padding: 0;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          cursor: zoom-in;
          text-align: left;
        }
        .gallery-card--featured {
          aspect-ratio: 16 / 9;
          max-height: 320px;
        }
        .gallery-card:not(.gallery-card--featured) {
          aspect-ratio: 4 / 3;
        }
        .gallery-card img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 400ms ease;
        }
        .gallery-card:hover img {
          transform: scale(1.03);
        }
        .gallery-card figcaption {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          padding: 28px 14px 12px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
          color: white;
          font-size: 11px;
          pointer-events: none;
        }
        .gallery-card figcaption span {
          display: block;
          font-weight: 600;
        }
        .gallery-card figcaption em {
          display: block;
          margin-top: 2px;
          opacity: 0.75;
          font-style: normal;
          font-family: var(--font-mono);
          font-size: 10px;
        }
        .gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(8px);
        }
        .gallery-lightbox img {
          max-width: min(920px, 100%);
          max-height: 85vh;
          border-radius: var(--radius-md);
          object-fit: contain;
        }
        .gallery-lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          font-size: 24px;
          cursor: pointer;
        }
        @media (max-width: 720px) {
          .gallery-grid { grid-template-columns: 1fr 1fr; }
          .gallery-grid .gallery-card:last-child { grid-column: span 2; }
        }
      `}</style>
    </div>
  );
}

/**
 * Client-side Smart Image Compression Utility
 * Resizes images to max dimensions and converts to compressed WebP/JPEG dataUrl.
 * Keeps uploaded assets < 100KB to protect browser memory and prevent localStorage quota crashes.
 */
export async function compressImage(
  file: File,
  maxWidth = 920,
  maxHeight = 920,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, return as is
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate constrained dimensions keeping aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }

      // Smooth bicubic resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try modern WebP first
      let dataUrl = canvas.toDataURL('image/webp', quality);
      if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
        // Fallback to high quality progressive JPEG
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      // Fallback to raw reader if canvas cannot decode
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = reject;
      fallbackReader.readAsDataURL(file);
    };

    reader.readAsDataURL(file);
  });
}


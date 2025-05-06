import { getLinkPreview } from "link-preview-js";


export const fetchLinkMetadata = async (text) => {
  if (typeof text !== 'string' || text.trim() === '') return null;

  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex);
  if (!urls || urls.length === 0) return null;

  const targetUrl = urls[0];

  try {
    const preview = await getLinkPreview(targetUrl, {
      timeout: 3000,
      followRedirects: 'follow'
    });

    return {
      url: preview.url,
      title: preview.title || 'No title',
      description: preview.description || '',
      image: Array.isArray(preview.images) && preview.images.length > 0 ? preview.images[0] : null
    };
  } catch (err) {
    console.error("Failed to fetch link preview:", err.message || err);
    return null;
  }
};

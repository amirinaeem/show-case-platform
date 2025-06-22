import { getLinkPreview } from "link-preview-js";

async function fetchLinkMetadata(text) {
  if (!text) return null;
  
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const urls = text.match(urlRegex);
  if (!urls || urls.length === 0) return null;

  try {
    const preview = await getLinkPreview(urls[0], {
      timeout: 3000, 
      followRedirects: 'follow'
    });
    
    return {
      url: preview.url,
      title: preview.title || 'No title',
      description: preview.description || '',
      image: preview.images?.[0] || null
    };
  } catch (err) {
    console.error("Link preview error for URL:", urls[0], err);
    return null;
  }
}

export default fetchLinkMetadata;

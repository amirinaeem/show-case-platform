
import { APPLICATIONS_URL } from '../constants';


const getCachedPreview = (url) => {
  const cached = localStorage.getItem(`preview:${url}`);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    if (parsed.expires < Date.now()) {
      localStorage.removeItem(`preview:${url}`);
      return null;
    }
    return parsed.data;
  } catch {
    localStorage.removeItem(`preview:${url}`);
    return null;
  }
};

const setCachedPreview = (url, data) => {
  localStorage.setItem(`preview:${url}`, JSON.stringify({
    data,
    expires: Date.now() + 3600000 // 1 hour
  }));
};

export const fetchLinkMetadata = async (text, { noCache = false } = {}) => {
  if (typeof text !== 'string' || text.trim() === '') return null;

  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex);
  if (!urls || urls.length === 0) return null;

  const targetUrl = urls[0];

  if (!noCache) {
    const cached = getCachedPreview(targetUrl);
    if (cached) return cached;
  }

  try {
    // Backend call
    const response = await fetch(`${APPLICATIONS_URL}/link-preview?url=${encodeURIComponent(targetUrl)}${noCache ? '&noCache=true' : ''}`);
    if (!response.ok) throw new Error('Failed to fetch');

    const preview = await response.json();

    if (preview && !noCache) {
      setCachedPreview(targetUrl, preview);
    }

    return preview;
  } catch (err) {
    console.error("Failed to fetch link preview:", err.message || err);
    return null;
  }
};

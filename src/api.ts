import { Readability } from '@mozilla/readability';

export const getPageInReaderView = async (url: string): Promise<string> => {
  try {
    const preparedURL = `/${url.replace(/https:\/\//, '')}`;
    const response = await fetch(preparedURL, { mode: "no-cors" });
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const parsed = new Readability(doc).parse();
    return parsed?.content || '';
  } catch (error) {
    throw error;
  }
}

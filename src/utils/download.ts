'use client';

export function downloadData(
  data: Uint8Array,
  fileName: string,
  mimeType: string,
) {
  // @ts-expect-error types say no, but browser says yes
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style = 'display: none';
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

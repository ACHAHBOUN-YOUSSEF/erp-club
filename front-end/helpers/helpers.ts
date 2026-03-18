export default function diffDays(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
}
export  function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function formatLastSeen(lastSeen: string | null | undefined) {
  if (!lastSeen) return ""; // ou ""
  
  const lastDate = new Date(lastSeen);
  const now = new Date();

  const diffMs = now.getTime() - lastDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffSec < 60) {
    return "Online";
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffH < 24) {
    return `${diffH} h ago`;
  } else {
    return `${diffD} d ago`;
  }
}
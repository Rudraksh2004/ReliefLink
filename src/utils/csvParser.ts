/**
 * Utility to parse CSV files for bulk community needs upload.
 */
export const parseCommunityNeedsCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Basic CSV parsing logic (can be replaced with PapaParse)
        const rows = text.split("\n").filter(row => row.trim() !== "");
        const headers = rows[0].split(",");
        
        const data = rows.slice(1).map(row => {
          const values = row.split(",");
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

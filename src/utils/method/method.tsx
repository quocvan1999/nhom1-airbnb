export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export function getCurrentDate(): string {
  const today: Date = new Date();

  const day: string = String(today.getDate()).padStart(2, "0"); // Lấy ngày
  const month: string = String(today.getMonth() + 1).padStart(2, "0"); // Tháng (0-11, nên phải cộng 1)
  const year: number = today.getFullYear(); // Năm

  return `${day}/${month}/${year}`; // Trả về dạng 'dd-mm-yyyy'
}

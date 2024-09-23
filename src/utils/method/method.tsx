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

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Lấy ngày, tháng, năm
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getUTCFullYear();

  // Lấy giờ, phút, giây (UTC)
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Kết quả cuối cùng
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function calculateDaysBetween(date1: string, date2: string): number {
  if (date1 !== "" && date2 !== "") {
    // Chuyển đổi chuỗi ngày tháng năm thành đối tượng Date
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    // Tính số mili giây giữa hai ngày
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());

    // Chuyển đổi số mili giây thành số ngày
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  }
  return 0;
}

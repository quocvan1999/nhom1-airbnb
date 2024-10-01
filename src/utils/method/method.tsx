// Hàm cắt chuỗi theo độ dài mong muốn
export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

// Hàm lấy ngày tháng năm hiện tại
export function getCurrentDate(): string {
  const today: Date = new Date();
  const day: string = String(today.getDate()).padStart(2, "0");
  const month: string = String(today.getMonth() + 1).padStart(2, "0");
  const year: number = today.getFullYear();
  return `${day}/${month}/${year}`; // Trả về dạng 'dd-mm-yyyy'
}

// Hàm format định dạng ngày tháng năm - giờ phút giây
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Hàm tính khoản cách giữa 2 chuỗi ngày
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

// Hàm set cookie lên trình duyệt
export function setCookie(name: string, value: string, days: number = 7): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Hàm lấy cookie từ trình duyệt
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Hàm xóa cookie từ trình duyệt
export function deleteCookie(name: string): void {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// Hàm decode JWT
export function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Hàm kiểm tra token có hết hạn hay không
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return true; // Nếu không decode được, coi như token đã hết hạn
  }
  const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
  // Kiểm tra nếu thời gian hiện tại lớn hơn exp thì token đã hết hạn
  if (decoded.exp && currentTime > decoded.exp) {
    return true; // Token đã hết hạn
  }

  return false; // Token còn hiệu lực
}

// Hàm kiểm tra login
export const checkLogin = (): boolean | null => {
  const token = getCookie("accessToken");

  if (token === null) {
    return null;
  } else {
    const decodedToken = decodeJWT(token);
    if (decodedToken === null) {
      deleteCookie("accessToken");
      return null;
    } else {
      const isExpires = isTokenExpired(token);
      if (isExpires === false) {
        return true;
      } else {
        deleteCookie("accessToken");
        return false;
      }
    }
  }
};

export function formatDate(dateString: string): string {
  return dateString.split("T")[0];
}

export function splitDateToObject(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

export const getCurrentDateTime = (): string => {
  const now: Date = new Date();

  const year: number = now.getFullYear();
  const month: string = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
  const day: string = String(now.getDate()).padStart(2, "0");

  const hours: string = String(now.getHours()).padStart(2, "0");
  const minutes: string = String(now.getMinutes()).padStart(2, "0");
  const seconds: string = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

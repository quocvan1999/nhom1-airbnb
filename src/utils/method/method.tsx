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

export function isDateInPast(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Đặt giờ, phút, giây, và mili giây của ngày hiện tại về 0 để chỉ so sánh ngày
  currentDate.setHours(0, 0, 0, 0);

  // Đặt giờ, phút, giây, và mili giây của ngày đầu vào về 0 để chỉ so sánh ngày
  inputDate.setHours(0, 0, 0, 0);

  return inputDate <= currentDate;
}

export function convertUSDToVND(value: number | string): string {
  // Chuyển đổi giá trị sang số
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    throw new Error("Giá trị không hợp lệ, không thể chuyển đổi thành số.");
  }

  // Tỉ giá chuyển đổi từ USD sang VND (25,000 VND/USD)
  const exchangeRate = 25000;

  // Tính toán mệnh giá VND
  const vndValue = numberValue * exchangeRate;

  // Định dạng số với phân đơn vị và thêm "VNĐ" vào cuối
  return `${vndValue.toLocaleString("vi-VN")} VNĐ`;
}

export function randomNumber(limit: number): number {
  return Math.floor(Math.random() * limit);
}

export function roundToDecimal(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

export function getFormattedDateTime(): string {
  const date = new Date();

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0, nên cần +1
  const year = date.getFullYear().toString();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

export const getDateRange = (
  startDateStr: string,
  endDateStr: string
): string[] => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const dateArray: string[] = [];

  let currentDate = new Date(
    Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  );
  const finalDate = new Date(
    Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  );

  while (currentDate <= finalDate) {
    dateArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dateArray;
};

export const totalCountMember = (countMember: number[]): number => {
  return countMember.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  );
};

export const getMonthString = (date: string | null) => {
  if (date !== null) {
    const dateFormat = new Date(date);

    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();

    return `${month} năm ${year}`;
  }
};

export const getYearString = (date: string | null) => {
  if (date !== null) {
    const dateFormat = new Date(date);

    const year = dateFormat.getFullYear();

    return year;
  }
};

export const toSlugWithId = (name: string, id: number): string => {
  return `${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")}-${id}`;
};

export const extractId = (slug: string): number | null => {
  const lastIndex = slug.lastIndexOf("-");
  if (lastIndex === -1) return null;
  const id = slug.slice(lastIndex + 1);
  return parseInt(id, 10);
};

export const fromSlugToText = (slugWithId: string): string => {
  // Loại bỏ phần `id` ở cuối bằng cách cắt bỏ chuỗi sau dấu `-` cuối cùng
  const lastIndex = slugWithId.lastIndexOf("-");
  if (lastIndex === -1) return slugWithId; // Trường hợp không có `-` trong slug

  const slug = slugWithId.slice(0, lastIndex);

  // Thay `-` bằng khoảng trắng và viết hoa chữ cái đầu mỗi từ
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

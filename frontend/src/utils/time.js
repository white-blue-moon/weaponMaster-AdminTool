// TODO 함수명 더 직관적으로 변경하기
// ex. 2025.01.23 17:00 과 같이 표시
export function formatDate(inputDate) {
    const date = new Date(inputDate); // 문자열을 Date 객체로 변환
    
    const year    = date.getFullYear();
    const month   = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() 값이 0부터 시작하므로 +1
    const day     = String(date.getDate()).padStart(2, '0');
    const hours   = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// ex. 2025년 1월 23일 오후 5:00 와 같이 표시
export function formatDateReadable(inputDate) {
    const date = new Date(inputDate)
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }

    return date.toLocaleString('ko-KR', options);
}

// calender 에서 사용하는 시간 포맷
export function formatToDateTime(inputDate, timeZone = "Asia/Seoul") {
    const date = new Date(inputDate)

    const datePart = date.toLocaleDateString("en-CA", { timeZone }) // 날짜 부분 ('YYYY-MM-DD')
    const timePart = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }) // 시간 부분 ('HH:mm')

    return `${datePart}T${timePart}`
}

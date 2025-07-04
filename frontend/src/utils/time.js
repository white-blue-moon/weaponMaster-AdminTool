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

// ex. 2025-06-18
export function formatDateYMD(inputDate) {
    return inputDate.split(' ')[0]
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

// ex. 04/17(목) 5:00AM
export function formatDateSimple(inputDate) {
    const date = new Date(inputDate)

    const month = String(date.getMonth() + 1).padStart(2, '0') // 01 ~ 12
    const day   = String(date.getDate()).padStart(2, '0')      // 01 ~ 31

    // 요일을 계산 (0: 일요일, 1: 월요일, ... 6: 토요일)
    const weekdays  = ['일', '월', '화', '수', '목', '금', '토']
    const dayOfWeek = weekdays[date.getDay()]

    let hours  = date.getHours()
    const amPm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12 // 12시간 형식 (0시는 12로 변환)

    const minutes = String(date.getMinutes()).padStart(2, '0') // 00 ~ 59

    
    return `${month}/${day}(${dayOfWeek}) ${hours}:${minutes}${amPm}`
}


// calender 에서 사용하는 시간 포맷
export function formatCalenderDate(inputDate) {
    const date     = new Date(inputDate)

    const datePart = date.toLocaleDateString("en-CA") // 날짜 부분 ('YYYY-MM-DD')
    const timePart = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) // 시간 부분 ('HH:mm')

    return `${datePart}T${timePart}`
}

export function getCalenderHourTime(hour) {
    const now = new Date()

    now.setDate(now.getDate());
    now.setHours(hour, 0, 0, 0)

    const calenderDate = formatCalenderDate(now)
    return calenderDate
}

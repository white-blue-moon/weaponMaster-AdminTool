// Express는 async 함수에서 발생한 오류를 자동으로 next(err)로 전달하지 않음 (catch 안 하면 서버가 죽기도 함)
// → try/catch 없이도 비동기 라우트 핸들러에서 발생한 에러를 next()로 전달할 수 있도록 도와주는 래퍼 함수
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

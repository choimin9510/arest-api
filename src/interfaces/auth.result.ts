export interface LoginResult {
  /** 세션 아이디 */
  sessionId: string;
}

export interface LoginCheckResult {
  /** 세션 아이디 */
  sessionId: string;

  /** 쇼핑몰 코드 */
  shopCode: string;

  /** 로그인 여부 */
  login: boolean;
}

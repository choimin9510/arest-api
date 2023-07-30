export interface LoginDto {
  /** 쇼핑몰 코드 */
  shopCode: string;

  /** 쇼핑몰 아이디 */
  id: string;

  /** 쇼핑몰 패스워드 */
  password: string;
}

export interface LoginResult {
  /** 세션 아이디 */
  sessionId: string;
}

export class ReissuanceDto {
  token: string;

  constructor(token: string) {
    this.token = 'Bearer ' + token;
  }
}

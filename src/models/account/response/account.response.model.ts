class AccountResponseModel {
  public account_id!: number;
  public first_name: string;
  public user_name: string;
  public from_email: string;
  public password: string;
  public smtp_host: string;
  public smtp_port: number;
  public communication_protocol: string;
  public messages_per_day: number;
  public minimum_time_gap: number;
  public imap_host: string;
  public imap_port: number;
  public created_at: string;
  public updated_at: string;
}

export default AccountResponseModel;

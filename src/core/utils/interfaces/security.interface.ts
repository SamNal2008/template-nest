export interface IJwtConfig {
  secret: string;
  signOptions: { expiresIn: string };
}

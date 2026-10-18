import { Logo } from "@/components/ui";

type AuthHeadingProps = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
};

export function AuthHeading({ title, subtitle, showLogo = true }: AuthHeadingProps) {
  return (
    <header className="auth-heading">
      {showLogo && <Logo />}
      <p className="eyebrow">PLAYER SELECT</p>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

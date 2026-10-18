import { passwordRules } from "../constants/passwordRules";

export function PasswordRulesChecklist({ password }: { password: string }) {
  return (
    <div className="quest-list">
      <p>MISSÃO: SENHA FORTE</p>
      {passwordRules.map((rule) => {
        const done = rule.test(password);
        return <span className={done ? "done" : ""} key={rule.label}><i>{done ? "✓" : "□"}</i>{rule.label}</span>;
      })}
    </div>
  );
}

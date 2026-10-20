import './PasswordRulesChecklist.css';
import { passwordRules } from '../../utils/validators';

function PasswordRulesChecklist({ password }) {
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

export default PasswordRulesChecklist;

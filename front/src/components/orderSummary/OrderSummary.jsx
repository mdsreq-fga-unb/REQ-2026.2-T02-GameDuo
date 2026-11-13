import './OrderSummary.css';
import PixelIcon from '../pixelIcon/PixelIcon';

function OrderSummary({ itens, total, nota, children }) {
  return (
    <div className="order-summary">
      <dl className="order-summary__list">
        {itens.map((item) => (
          <div key={item.rotulo}>
            <dt>{item.rotulo}</dt>
            <dd>{item.moeda && <PixelIcon type="coin" />} {item.valor}</dd>
          </div>
        ))}
      </dl>
      <div className="order-summary__total">
        <span>Total</span>
        <strong key={total}>{total}</strong>
      </div>
      {children}
      {nota && <p className="order-summary__note"><PixelIcon type="shield" /> {nota}</p>}
    </div>
  );
}

export default OrderSummary;

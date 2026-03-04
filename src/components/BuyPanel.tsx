import { X, ExternalLink, ShoppingCart } from 'lucide-react'
import { getItemById, type ClothingItem } from '../data/clothing'

interface Props {
  itemIds: string[]
  onClose: () => void
}

export default function BuyPanel({ itemIds, onClose }: Props) {
  const items = itemIds.map(getItemById).filter(Boolean) as ClothingItem[]
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel buy-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><ShoppingCart size={20} /> Купить образ</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🛒</span>
            <p>В образе пока нет вещей</p>
            <p className="empty-hint">Добавьте вещи из гардероба</p>
          </div>
        ) : (
          <>
            <div className="buy-items-list">
              {items.map(item => (
                <div key={item.id} className="buy-item">
                  <span className="buy-item-emoji">{item.emoji}</span>
                  <div className="buy-item-info">
                    <span className="buy-item-name">{item.name}</span>
                    <span className="buy-item-marketplace">{item.marketplace}</span>
                  </div>
                  <span className="buy-item-price">{item.price} {item.currency}</span>
                  <a
                    href={item.marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-item-link"
                  >
                    <ExternalLink size={14} />
                    <span>Купить</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="buy-total">
              <span className="buy-total-label">Итого за образ:</span>
              <span className="buy-total-price">{total.toLocaleString('ru-RU')} ₽</span>
            </div>

            <div className="buy-disclaimer">
              Нажимая «Купить», вы перейдёте на сайт маркетплейса для завершения покупки
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { type SavedLook } from '../utils/storage'
import { getItemById } from '../data/clothing'
import { X, Trash2, Play, ShoppingBag } from 'lucide-react'

interface Props {
  looks: SavedLook[]
  onApply: (look: SavedLook) => void
  onDelete: (id: string) => void
  onBuy: (look: SavedLook) => void
  onClose: () => void
}

export default function LookGallery({ looks, onApply, onDelete, onBuy, onClose }: Props) {
  if (looks.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-panel gallery-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Мои образы</h2>
            <button className="modal-close" onClick={onClose}><X size={18} /></button>
          </div>
          <div className="empty-state">
            <span className="empty-emoji">👗</span>
            <p>У вас пока нет сохранённых образов</p>
            <p className="empty-hint">Создайте образ и нажмите «Сохранить»</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel gallery-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Мои образы ({looks.length})</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="looks-grid">
          {looks.map(look => (
            <div key={look.id} className="look-card">
              {look.screenshot ? (
                <img src={look.screenshot} alt={look.name} className="look-preview" />
              ) : (
                <div className="look-preview look-placeholder">
                  <span>👗</span>
                </div>
              )}

              <div className="look-info">
                <span className="look-name">{look.name}</span>
                <span className="look-date">
                  {new Date(look.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <div className="look-items-mini">
                {look.selectedItems.slice(0, 4).map(itemId => {
                  const item = getItemById(itemId)
                  return item ? (
                    <span key={itemId} className="look-item-dot" title={item.name}>
                      {item.emoji}
                    </span>
                  ) : null
                })}
                {look.selectedItems.length > 4 && (
                  <span className="look-item-more">+{look.selectedItems.length - 4}</span>
                )}
              </div>

              <div className="look-actions">
                <button className="look-action-btn" onClick={() => onApply(look)} title="Применить">
                  <Play size={14} />
                </button>
                <button className="look-action-btn buy" onClick={() => onBuy(look)} title="Купить">
                  <ShoppingBag size={14} />
                </button>
                <button className="look-action-btn delete" onClick={() => onDelete(look.id)} title="Удалить">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

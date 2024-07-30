export default function Item({item, onDeleteItem, onToggleItem}) {
    return (
      <li key={item.id}>
            <input type="checkbox" checked={item.defaultChecked} onChange={() => onToggleItem(item.id)}/>
            <span style={ item.defaultChecked ? {textDecoration: 'line-through'} : {}}>{item.quantity} {item.name}</span>
            <button onClick={() => onDeleteItem(item.id)}>&times;</button>
          </li>
    )
  }
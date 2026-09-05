import { useState } from "react";
import Logo from './Logo';
import Form from './Form';
import { PackingList } from "./PackingList";
import { Stats } from "./Stats";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: true },
//   { id: 3, description: "Charger", quantity: 12, packed: false },
// ];

export default function App() {
  const [items, setItems] = useState([]);

  const handleAddItems = (item) => {
    setItems(items => [...items, item]);
  };

  const handleDeleteItem = (id) => {
    setItems(items => items.filter(item => item.id !== id))
  }

  const handleToggleItem = id => {
    setItems(items => items.map(item => 
      item.id === id ? {...item, packed: !item.packed} : item
    ));
  }

  const handleClearItems = () => {
    const confirmed = window.confirm('are you sure you want to clear the list?');
    if (confirmed)  setItems([]);
  }
  
  return (
    <div className='app'>
      <Logo />
      <Form onAddItems={handleAddItems}/>
      <PackingList 
        items={items} 
        onDeleteItem={handleDeleteItem} onToggleItems={handleToggleItem}
        onClearList={handleClearItems}
      />
      <Stats items={items} />
    </div>
  )
};



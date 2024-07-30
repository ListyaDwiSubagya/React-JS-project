/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Form from './components/Form';
import GroceryList from './components/GroceryList';
import Footer from './components/Footer';

const groceryItems = [
  {
    id: 1,
    name: 'Kopi Bubuk',
    quantity: 2,
    defaultChecked: true,
  },
  {
    id: 2,
    name: 'Gula Pasir',
    quantity: 5,
    defaultChecked: false,
  },
  {
    id: 3,
    name: 'Air Mineral',
    quantity: 3,
    defaultChecked: false,
  },
];

export default function App() {

  const [items, setItems] = useState(groceryItems);

  function handleAddItem(item) {
    setItems([...items, item]);
  }

  function handleDeleteItem(id){
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) => items.map((item) => (item.id === id ? {...item, defaultChecked: !item.defaultChecked}
    : item)));
  }

  function handlerClearItems() {
    setItems([]);
  }

  return (

      <div className="app">
        <Header/>
        <Form onAddItem={handleAddItem}/>
        <GroceryList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem}
          onClearItems={handlerClearItems}
        />
        <Footer items={items}/>
      </div>
  )
}
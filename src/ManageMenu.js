import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './CSS/ManageMenu.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

// รายชื่อหมวดสุขภาพ (แสดงเป็นปุ่มหลัก)
const categoryList = [
  { label: 'โรคอ้วน', path: 'disease/Obesity' },
  { label: 'โรคไต', path: 'disease/kidney disease' },
  { label: 'โรคความดันโลหิตสูง', path: 'disease/Hypertension' },
  { label: 'เพิ่มน้ำหนัก', path: 'goals/gain weight' },
  { label: 'ลดน้ำหนัก', path: 'goals/lose weight' },
  { label: 'รักษาน้ำหนัก', path: 'goals/Maintain weight' }
];

// ประเภทเมนูที่เลือกได้
const menuTypes = ['meals', 'rice', 'snacks'];

function ManageMenu() {
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [selectedType, setSelectedType] = useState(menuTypes[0]);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeals();
  }, [selectedCategory, selectedType]);

  const fetchMeals = async () => {
    const path = `${selectedCategory.path}/${selectedType}`;
    const mealRef = collection(db, path);
    const snapshot = await getDocs(mealRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), edit: false }));
    setMeals(data);
  };

  const handleDelete = async (id) => {
    const path = `${selectedCategory.path}/${selectedType}`;
    await deleteDoc(doc(db, path, id));
    fetchMeals();
  };

  const handleEditToggle = (id) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, edit: !m.edit } : m)));
  };

  const handleChange = (id, field, value) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSave = async (meal) => {
    const path = `${selectedCategory.path}/${selectedType}`;
    const { id, food_name, calories, img, ingredients } = meal;
    await updateDoc(doc(db, path, id), {
      food_name,
      calories: Number(calories),
      img,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split('\n')
    });
    fetchMeals();
  };

  const filteredMeals = meals.filter(m =>
    m.food_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-container">
      <div className="navbar">
        <div className="brand">Meal-Master</div>
        <div className="nav-menu">
          <Link to="/manage">จัดการเมนูอาหาร</Link>
          <Link to="/add">เพิ่มเมนูอาหาร</Link>
          <Link to="/users">จัดการบัญชีผู้ใช้</Link>
        </div>
        <div className="profile-icon">👤</div>
      </div>

      <h2 className="page-title">จัดการเมนูอาหาร</h2>

      {/* ปุ่มหมวดสุขภาพ */}
      <div className="filters">
        {categoryList.map(cat => (
          <button
            key={cat.path}
            className={`filter-btn ${selectedCategory.path === cat.path ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ปุ่มประเภทเมนู */}
      <div className="filters" style={{ marginTop: '1rem' }}>
        {menuTypes.map(type => (
          <button
            key={type}
            className={`filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}

        {/* ช่องค้นหา */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหาเมนู"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* รายการเมนู */}
      <div className="menu-list">
        <div className="menu-row header">
          <div>ชื่อเมนู</div>
          <div>ภาพ</div>
          <div>วัตถุดิบ</div>
          <div>แคลอรี่</div>
          <div>การจัดการ</div>
        </div>
        {filteredMeals.map(meal => (
          <div className="menu-row" key={meal.id}>
            <div>
              {meal.edit ? (
                <input value={meal.food_name} onChange={(e) => handleChange(meal.id, 'food_name', e.target.value)} />
              ) : (
                <b>{meal.food_name}</b>
              )}
            </div>
            <div className="menu-image">
              {meal.edit ? (
                <input value={meal.img} onChange={(e) => handleChange(meal.id, 'img', e.target.value)} />
              ) : (
                <img src={meal.img} alt="อาหาร" />
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              {meal.edit ? (
                <textarea
                  rows={6}
                  value={Array.isArray(meal.ingredients) ? meal.ingredients.join('\n') : meal.ingredients}
                  onChange={(e) => handleChange(meal.id, 'ingredients', e.target.value)}
                />
              ) : (
                <ul>
                  {Array.isArray(meal.ingredients)
                    ? meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                    : null}
                </ul>
              )}
            </div>
            <div>
              {meal.edit ? (
                <input
                  type="number"
                  value={meal.calories}
                  onChange={(e) => handleChange(meal.id, 'calories', e.target.value)}
                />
              ) : (
                <b>{meal.calories}</b>
              )}
            </div>
            <div className="menu-actions">
              {meal.edit ? (
                <button className="edit-btn" onClick={() => handleSave(meal)}>💾</button>
              ) : (
                <button className="edit-btn" onClick={() => handleEditToggle(meal.id)}><FaEdit /></button>
              )}
              <button className="delete-btn" onClick={() => handleDelete(meal.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageMenu;

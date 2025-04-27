import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CSS/AddMenu.css';

const categoryList = [
  { label: 'โรคอ้วน', path: 'disease/Obesity' },
  { label: 'โรคไต', path: 'disease/kidney disease' },
  { label: 'โรคความดันโลหิตสูง', path: 'disease/Hypertension' },
  { label: 'เพิ่มน้ำหนัก', path: 'goals/gain weight' },
  { label: 'ลดน้ำหนัก', path: 'goals/lose weight' },
  { label: 'รักษาน้ำหนัก', path: 'goals/Maintain weight' }
];

const menuTypes = ['meals', 'rice', 'snacks'];

function AddMenu() {
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [selectedType, setSelectedType] = useState(menuTypes[0]);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [img, setImg] = useState('');
  const [ingredients, setIngredients] = useState(['']);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async () => {
    if (!foodName || !calories || !img || ingredients.some(ing => ing.trim() === '')) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const fullPath = `${selectedCategory.path}/${selectedType}`;

    await addDoc(collection(db, fullPath), {
      food_name: foodName,
      calories: Number(calories),
      img,
      ingredients
    });

    alert('เพิ่มเมนูเรียบร้อยแล้ว!');
    setFoodName('');
    setCalories('');
    setImg('');
    setIngredients(['']);
  };

  return (
    <div className="add-menu-container">
      <div className="navbar">
        <div className="brand">Meal-Master</div>
        <div className="nav-menu">
          <a href="/manage">จัดการเมนูอาหาร</a>
          <a href="/add">เพิ่มเมนูอาหาร</a>
          <a href="/users">จัดการบัญชีผู้ใช้</a>
        </div>
        <div className="profile-icon">👤</div>
      </div>

      <h2 className="page-title">เพิ่มเมนูอาหาร</h2>

      {/* ปุ่มเลือกหมวดสุขภาพ */}
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

      {/* ปุ่มเลือกประเภทเมนู */}
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
      </div>

      <div className="form-box">
        <h3>เมนูใหม่</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>ชื่ออาหาร</label>
            <input value={foodName} onChange={e => setFoodName(e.target.value)} />
            <label>แคลอรี่</label>
            <input type="number" value={calories} onChange={e => setCalories(e.target.value)} />
            <label>ลิงก์รูปภาพ</label>
            <input value={img} onChange={e => setImg(e.target.value)} />
          </div>
          <div className="form-group">
            {ingredients.map((ing, index) => (
              <div key={index}>
                <label>วัตถุดิบ {index + 1}</label>
                <input
                  value={ing}
                  onChange={e => handleIngredientChange(index, e.target.value)}
                />
              </div>
            ))}
            <button className="add-btn" onClick={handleAddIngredient}>➕ วัตถุดิบ</button>
          </div>
        </div>
        <button className="submit-btn" onClick={handleSubmit}>บันทึกเมนูใหม่</button>
      </div>
    </div>
  );
}

export default AddMenu;

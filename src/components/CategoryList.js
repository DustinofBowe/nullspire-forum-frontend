import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryList({ categories }) {
  if (!categories.length) return <p>No categories found.</p>;

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>
          <Link to={`/category/${cat.id}`}>{cat.name}</Link>
        </li>
      ))}
    </ul>
  );
}

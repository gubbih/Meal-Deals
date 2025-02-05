import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/meal/1">Meal 1</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
}

export default Navigation;

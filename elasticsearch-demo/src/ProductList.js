import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/products/_search')
      .then(response => {
        // Log the response to check the structure
        console.log(response.data); 
        setProducts(response.data.hits.hits); 
      })
      .catch(error => {
        setError("There was an error fetching the data!");
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h2>{product._source.name}</h2>
            <p>Price: ${product._source.price}</p>
            <p>Category: {product._source.category}</p>
            <p>Stock: {product._source.stock_quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/products/_search")
      .then((response) => {
        setProducts(response.data.hits.hits);
      })
      .catch((error) => {
        setError("There was an error fetching the data!");
        console.error(error);
      });
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, product) => acc + product._source.stock_quantity, 0);

  // Prepare data for Pie Chart (products by category)
  const categoryData = products.reduce((acc, product) => {
    const category = product._source.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  // Prepare data for Bar Chart (product price distribution)
  const priceLabels = products.map((product) => product._source.name);
  const priceValues = products.map((product) => product._source.price);

  // Prepare data for Line Chart (price trends)
  const lineData = {
    labels: priceLabels,
    datasets: [
      {
        label: "Price Trends",
        data: priceValues,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Prepare data for Doughnut Chart (stock distribution)
  const stockData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Stock by Category",
        data: categoryValues,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="App">
      <h1>Product Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <div className="dashboard">
        <h2>Dashboard</h2>

        <div className="statistics">
          <p>Total Products: {totalProducts}</p>
          <p>Total Stock: {totalStock}</p>
        </div>

        {/* First Row: Bar and Pie Chart */}
        <div className="chart-container">
          <div className="chart">
            <h3>Product Categories</h3>
            <Pie
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    label: "Products by Category",
                    data: categoryValues,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>

          <div className="chart">
            <h3>Product Prices</h3>
            <Bar
              data={{
                labels: priceLabels,
                datasets: [
                  {
                    label: "Price Distribution",
                    data: priceValues,
                    backgroundColor: "#36A2EB",
                    borderColor: "#36A2EB",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Second Row: Line and Doughnut Chart */}
        <div className="chart-container">
          <div className="chart">
            <h3>Price Trends</h3>
            <Line data={lineData} />
          </div>

          <div className="chart">
            <h3>Stock Distribution</h3>
            <Doughnut data={stockData} />
          </div>
        </div>
      </div>

      <h2>Available Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Brand</th>
            <th>Stock Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._source.name}</td>
              <td>${product._source.price}</td>
              <td>{product._source.category}</td>
              <td>{product._source.description}</td>
              <td>{product._source.brand}</td>
              <td>{product._source.stock_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES_API = "https://meeyaladminbackend-production.up.railway.app/api/categories";
const SUBCATEGORIES_API = "https://meeyaladminbackend-production.up.railway.app/api/subcategories";

const CategorySelector = ({ onCategoryChange, onSubcategoryChange, iscategory, issubcategory }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(iscategory || "");
    const [selectedSubcategory, setSelectedSubcategory] = useState(issubcategory || "");
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(CATEGORIES_API);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch subcategories from backend by selected category ID
    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) return;
        setLoadingSubcategories(true);
        try {
            const response = await axios.get(`${SUBCATEGORIES_API}/${categoryId}`);
            setSubcategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        } finally {
            setLoadingSubcategories(false);
        }
    };

    // If editing and category already selected
    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSubcategory("");
        onCategoryChange(categoryId);
        fetchSubcategories(categoryId);
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategory(subcategoryId);
        onSubcategoryChange(subcategoryId);
    };

    return (
        <div>
            {/* Category Selection */}
            <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-1">Category*</label>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                    disabled={loadingCategories}
                >
                    <option value="">
                        {loadingCategories ? "Loading categories..." : "Select Category"}
                    </option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subcategory Selection */}
            <div className="mt-8">
                <label className="block text-gray-700 font-semibold mb-1">Subcategory*</label>
                <select
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                    disabled={loadingSubcategories || subcategories.length === 0}
                >
                    <option value="">
                        {loadingSubcategories
                            ? "Loading..."
                            : subcategories.length === 0
                            ? "No subcategories"
                            : "Select Subcategory"}
                    </option>
                    {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                            {sub.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CategorySelector;

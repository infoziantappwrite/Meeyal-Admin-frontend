import React, { useState, useEffect } from "react";
import { databases } from "../../lib/appwrite"; // Import Appwrite database service

const CategorySelector = ({ onCategoryChange, onSubcategoryChange, iscategory, issubcategory }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(iscategory?.$id || "");
    const [selectedSubcategory, setSelectedSubcategory] = useState(issubcategory?.$id || "");
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_CATA_COLLECTION_ID
                );
                setCategories(response.documents);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) return;

        setLoadingSubcategories(true);
        try {
            const res = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBCATA_COLLECTION_ID
            );

            // Only keep subcategories that belong to the selected category
            const filteredSubcategories = res.documents.filter(
                (sub) => sub.categories?.$id === categoryId
            );

            setSubcategories(filteredSubcategories);
        } catch (err) {
            console.error("Error fetching subcategories:", err);
        } finally {
            setLoadingSubcategories(false);
        }
    };

    // Load subcategories if an existing category is provided (Editing case)
    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSubcategory(""); // Reset subcategory when category changes
        onCategoryChange(categoryId); // Send to parent
        fetchSubcategories(categoryId);
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategory(subcategoryId);
        onSubcategoryChange(subcategoryId); // Send to parent
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
                    disabled={loadingCategories || categories.length === 0}
                >
                    <option value="">
                        {loadingCategories ? "Loading categories..." : "Select Category"}
                    </option>
                    {categories.map((cat) => (
                        <option key={cat.$id} value={cat.$id}>
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
                        disabled={loadingSubcategories}
                    >
                        <option value="">
                            {loadingSubcategories
                                ? "Loading..."
                                : "Select Subcategory"}
                        </option>
                        {subcategories.map((sub) => (
                            <option key={sub.$id} value={sub.$id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
        </div>
    );
};

export default CategorySelector;

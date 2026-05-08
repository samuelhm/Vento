import { useLoaderData, useNavigate } from "react-router";
import { HeroSlider } from "../../components/HeroSlider/HeroSlider";
import { CategoryCard } from "../../components/CategoryCard";
import type { CategoryUI } from "../../types/categoryTypes";
import { ActionSection } from "../../components/ActionSection/ActionSection";
import { CATEGORY_GROUPS, CATEGORY_UI_CONFIG } from "./utils"; 

export const Home = () => {
  const categories = useLoaderData() as CategoryUI[];
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number) => {
    if (categoryId === undefined) return;
    const searchParams = new URLSearchParams({
      categoryId: categoryId.toString(),
      page: "0",
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <>
      <HeroSlider />
      <main className="max-w-5xl mx-auto px-8 py-16 space-y-20">
        {CATEGORY_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {group.title}
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories
                .filter(cat => group.items.includes(cat.name.toLowerCase()))
                .map((cat, index) => {
                  const config = CATEGORY_UI_CONFIG[cat.name.toLowerCase()];
                  
                  return (
                    <CategoryCard
                      key={index}
                      title={cat.name}
                      altText={config?.alt || cat.name}
                      totalAds={cat.count}
                      imageUrl={config?.image || cat.url}
                      onClick={() => handleCategoryClick(cat.id)}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </main>
      <ActionSection />
    </>
  );
};
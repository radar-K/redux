// src/App.tsx
import { useSearchRecipesQuery } from "./features/recipes/ recipesApi";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "./features/favorites/favoritesSlice";
import type { Recipe } from "./features/types/recipe";
import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("pasta");
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((s) => s.favorites.items);
  const [openRecipeId, setOpenRecipeId] = useState<number | null>(null);

  // RTK Query hook
  const { data, isFetching, isError, error } = useSearchRecipesQuery({
    q: query,
  });

  // Toggle favorit
  const toggleFavorite = (r: Recipe) => {
    const exists = favorites.some((f) => f.id === r.id);
    if (exists) {
      dispatch(removeFavorite(r.id));
    } else {
      dispatch(addFavorite({ id: r.id, name: r.name, image: r.image }));
    }
  };

  return (
    <div className="app-container">
      {/* Sökfält */}
      <div className="search-section">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök recept, t.ex. 'pasta', 'kyckling', 'sallad'..."
        />
      </div>

      {/* Laddning */}
      {isFetching && <div className="loading-spinner">🔍 Söker recept...</div>}

      {/* Fel */}
      {isError && (
        <div className="error-message">
          ❌ Något gick fel: {error?.toString()}
        </div>
      )}

      {/* Sökresultat */}
      <div className="recipes-list">
        {data?.recipes.map((r) => {
          const isFav = favorites.some((f) => f.id === r.id);
          const isOpen = openRecipeId === r.id;

          return (
            <div key={r.id} className="recipe-card">
              <div className="recipe-header">
                {r.image && (
                  <img src={r.image} alt={r.name} className="recipe-image" />
                )}
                <div className="recipe-info">
                  <h3>{r.name}</h3>
                  <div className="button-group">
                    <button
                      className={`btn btn-favorite ${isFav ? "active" : ""}`}
                      onClick={() => toggleFavorite(r)}
                    >
                      {isFav ? "💖 Favorit" : "🤍 Lägg till"}
                    </button>
                    <button
                      className="btn btn-toggle"
                      onClick={() => setOpenRecipeId(isOpen ? null : r.id)}
                    >
                      {isOpen ? "👆 Dölj" : "👇 Visa recept"}
                    </button>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="recipe-details">
                  <h4>🥘 Ingredienser</h4>
                  <ul>
                    {r.ingredients.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                  <h4>📝 Instruktioner</h4>
                  <ol>
                    {r.instructions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Favoriter */}
      <section className="favorites-section">
        <h2>Favoriter ({favorites.length})</h2>
        {favorites.length > 0 ? (
          <>
            <button
              className="btn btn-clear"
              onClick={() => dispatch(clearFavorites())}
            >
              🗑️ Rensa alla favoriter
            </button>
            <ul className="favorites-list">
              {favorites.map((f) => (
                <li key={f.id} className="favorite-item">
                  {f.image && (
                    <img
                      src={f.image}
                      alt={f.name}
                      className="favorite-image"
                    />
                  )}
                  <span className="favorite-name">{f.name}</span>
                  <button
                    className="btn btn-remove"
                    onClick={() => dispatch(removeFavorite(f.id))}
                  >
                    ✕ Ta bort
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="empty-state">
            <p>Inga favoriter ännu 🤔</p>
            <p>Klicka på "🤍 Lägg till" för att spara dina favoritrecept!</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;

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
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Redux Recipe Explorer</h1>

      {/* sökfält */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök recept, t.ex. 'pasta'"
          style={{ padding: 8, width: 300 }}
        />
      </div>

      {/* sökresultat */}
      {data?.recipes.map((r) => {
        const isFav = favorites.some((f) => f.id === r.id);
        const isOpen = openRecipeId === r.id;

        return (
          <div
            key={r.id}
            style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  style={{ width: 80, height: 80 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3>{r.name}</h3>
                <button onClick={() => toggleFavorite(r)}>
                  {isFav ? "Ta bort favorit" : "Lägg till favorit"}
                </button>
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => setOpenRecipeId(isOpen ? null : r.id)}
                >
                  {isOpen ? "Dölj recept" : "Visa recept"}
                </button>
              </div>
            </div>

            {isOpen && (
              <div style={{ marginTop: 10 }}>
                <h4>Ingredienser</h4>
                <ul>
                  {r.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
                <h4>Instruktioner</h4>
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

      {/* favoriter */}
      <section>
        <h2>Favoriter ({favorites.length})</h2>
        {favorites.length > 0 ? (
          <>
            <button onClick={() => dispatch(clearFavorites())}>
              Rensa alla
            </button>
            <ul>
              {favorites.map((f) => (
                <li key={f.id} style={{ marginTop: 8 }}>
                  {f.image && (
                    <img
                      src={f.image}
                      alt={f.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        verticalAlign: "middle",
                        marginRight: 8,
                        borderRadius: 4,
                      }}
                    />
                  )}
                  <strong>{f.name}</strong>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => dispatch(removeFavorite(f.id))}
                  >
                    Ta bort
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Inga favoriter ännu — klicka "Lägg till favorit" på ett recept.</p>
        )}
      </section>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./styles.css";
import supabase from "./supabase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  const appTitle = "TODAY I LEARNED!";
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      async function getFacts() {
        const { data: facts, error } = await query
          .order("id", { ascending: false })
          .limit(1000);
        // .order("votesInteresting", { ascending: true });
        setFacts(facts);
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      {/* HEADER */}
      <Header
        titleObj={appTitle}
        setShowFormObj={setShowForm}
        showFormObj={showForm}
      />

      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Header(props) {
  return (
    <header className="header">
      <div className="logo">
        <img src="./logo.png" alt="Today I Learned Logo" />
        <h1>{props.titleObj}</h1>
      </div>

      <button
        className="btn btn-large btn-share"
        onClick={() => props.setShowFormObj((show) => !show)}
      >
        {props.showFormObj ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function Loader() {
  return <p className="loadingMessage">Loading...</p>;
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm(props) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");

  async function handleSubmit(e) {
    //1=Prevent browser reload
    e.preventDefault();
    console.log(text, source, category);

    //2=Check if the data is valid if so create new fact
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      //3=Create fact object
      // const newFact = {
      //   id: Math.trunc(Math.random() * 100000),
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      props.setIsUploading(true);
      //3= UPLOAD FACT TO SUPABASE AND RECEIVE THE NEW FACT FROM IT
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      props.setIsUploading(false);

      //4=Add the new fact to the UI: add the fact to state (new fact + previous facts)
      if (!error) {
        props.setFacts((facts) => [newFact[0], ...facts]);
      }

      //5=Reset input fiels to empty
      setText("");
      setSource("");
      setCategory("");

      //6=Close the form
      props.setShowForm((show) => !show); //or just false
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={props.isUploading}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Thrustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={props.isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={props.isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={props.isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter(props) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => props.setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => props.setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList(props) {
  if (props.facts.length === 0) {
    return <p className="message">No facts for this category... 😥</p>;
  }

  return (
    <section>
      <ul className="fact-list">
        {props.facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={props.setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact(props) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: props.fact[columnName] + 1 })
      .eq("id", props.fact.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      props.setFacts((facts) =>
        facts.map((f) => (f.id === props.fact.id ? updatedFact[0] : f))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {props.fact.text}
        <a className="source" href={props.fact.source}>
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (cat) => cat.name === props.fact.category
          ).color,
        }}
      >
        {props.fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {props.fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {props.fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {props.fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;

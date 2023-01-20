`use strict`;

//TEST DATA
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

//Buttons
const shareBtn = document.querySelector(".btn-share");

//Form
const form = document.querySelector(".fact-form");

//Fact list
const factList = document.querySelector(".fact-list");

//Creating DOM Elements : Rendering facts in list
factList.innerHTML = "";

//Load data from Supabase
async function loadFacts() {
  const response = await fetch(
    "https://tmcmqcqoodrktdrcjvad.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY21xY3Fvb2Rya3RkcmNqdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwODIyNjYsImV4cCI6MTk4OTY1ODI2Nn0.11XEU8ak1hdCH4PmEV6hj-evA63vafJWghTWkm3b7lI",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY21xY3Fvb2Rya3RkcmNqdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwODIyNjYsImV4cCI6MTk4OTY1ODI2Nn0.11XEU8ak1hdCH4PmEV6hj-evA63vafJWghTWkm3b7lI",
      },
    }
  );
  const data = await response.json();
  //   console.log(data);
  //   const filteredData = data.filter((fact) => fact.category === "society");
  createFactList(data);
}

loadFacts();

function createFactList(facts) {
  const htmlArray = facts.map(
    (fact) => `
        <li class="fact">
            <p>${fact.text}
                <a class="source"
                    href="${fact.source}"
                    target="_blank">
                    (Source)
                </a>
            </p>
            <span class="tag" style="background-color: ${
              CATEGORIES.find((cat) => cat.name === fact.category).color
            }">
                ${fact.category}
            </span>
        </li>`
  );
  const html = htmlArray.join("");
  factList.insertAdjacentHTML("afterbegin", html);
}

let isHidden = true;
shareBtn.addEventListener("click", () => {
  if (isHidden) {
    form.classList.add("hidden");
    shareBtn.textContent = "SHARE A FACT";
  } else {
    form.classList.remove("hidden");
    shareBtn.textContent = "CLOSE";
  }
  isHidden = !isHidden;
});

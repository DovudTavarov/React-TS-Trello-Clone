import { useState, useEffect, useRef } from "react";
import DoneIcon from "@mui/icons-material/Done";
import "./App.css";
import Box from "./component/Box";

interface Card {
  id: number;
  text: string;
}

interface List {
  id: number;
  title: string;
  cards: Card[];
}

const updateLocalStorage = (list: List[]) => {
  localStorage.setItem("trelloList", JSON.stringify(list));
};

const App: React.FC = () => {
  const [list, setList] = useState<List[]>(() => {
    const savedList = localStorage.getItem("trelloList");
    return savedList ? JSON.parse(savedList) : [];
  });
  const [editListId, setEditListId] = useState<number | null>(null);
  const [listInputVal, setListInputVal] = useState<string>("");
  const [draggedEl, setDraggedEl] = useState<{
    listId: number;
    card: Card;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputVal, setInputVal] = useState<string>("");
  const [editId, setEditId] = useState<boolean | null>(null);

  useEffect(() => {
    if (editListId || listInputVal.trim() === "") {
      inputRef.current?.focus();
    }
  }, [editListId, listInputVal]);

  useEffect(() => {
    updateLocalStorage(list);
  }, [list]);

  const onDragStopped = (dropId: number) => {
    if (!draggedEl) return;
    const updatedList = list.map((l) => {
      if (l.id === draggedEl.listId) {
        l.cards = l.cards.filter((card) => card.id !== draggedEl.card.id);
      }
      if (l.id === dropId) {
        return { ...l, cards: [...l.cards, draggedEl.card] };
      }
      return l;
    });
    setList(updatedList);
    setDraggedEl(null);
  };

  const setCard = (cards: Card[], listId: number) => {
    const newList = list.map((l) => {
      if (l.id === listId) {
        l.cards = cards;
      }
      return l;
    });
    setList(newList);
  };

  const handleAddCard = (id: number, text: string) => {
    const newList = list.map((l) => {
      if (l.id === id) {
        const newCard: Card = {
          id: Math.floor(Math.random() * 1000000),
          text: text || "",
        };
        l.cards.push(newCard);
        return l;
      }
      return l;
    });
    setList(newList);
    setInputVal("");
    setEditId(true);
  };

  const handleAddBox = () => {
    const value = listInputVal.trim();
    const newBox: List = {
      id: Date.now(),
      title: value || "New List",
      cards: [],
    };
    setList((prevList) => [...prevList, newBox]);
    setEditListId(newBox.id);
    setListInputVal("");
  };

  const handleListInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListInputVal(e.target.value);
  };

  const handleSaveListIdChange = (listId: number) => {
    const value = listInputVal.trim();
    if (value.length > 0) {
      const updatedList = list.map((l) =>
        l.id === listId ? { ...l, title: value } : l
      );
      setList(updatedList);
    }
    setEditListId(null);
    setListInputVal("");
  };

  const handleListDelete = (listId: number) => {
    const newBoxList = list.filter((l) => l.id !== listId);
    setList(newBoxList);
  };

  const handleEnterPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    listId: number
  ) => {
    if (e.key === "Enter") {
      handleSaveListIdChange(listId);
    }
  };

  return (
    <>
      <div className="head">
        <h1>React Trello Clone</h1>
      </div>
      <div className="main">
        <div className="left">
          <div className="container">
            {list.map((l) => {
              const editListMode = editListId === l.id;
              return editListMode ? (
                <div className="input-header" key={l.id}>
                  <input
                    ref={inputRef}
                    placeholder="New List..."
                    value={listInputVal}
                    onKeyDown={(e) => handleEnterPress(e, l.id)}
                    onChange={handleListInputVal}
                    type="text"
                  />
                  <DoneIcon onClick={() => handleSaveListIdChange(l.id)} />
                </div>
              ) : (
                <div key={l.id} className="content">
                  <Box
                    inputVal={inputVal}
                    setInputVal={setInputVal}
                    editId={editId}
                    setEditId={setEditId}
                    setCard={setCard}
                    handleAddCard={handleAddCard}
                    setDraggedEl={setDraggedEl}
                    onDragStopped={onDragStopped}
                    handleListDelete={handleListDelete}
                    listInputVal={l.title}
                    list={l}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="right">
          <div onClick={handleAddBox} className="add_list">
            Add a list...
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

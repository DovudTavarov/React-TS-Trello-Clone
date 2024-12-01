import { FC } from "react";
import Card from "./Card";
import ClearIcon from "@mui/icons-material/Clear";

interface CardType {
  id: number;
  text: string;
}

interface ListType {
  id: number;
  title: string;
  cards: CardType[];
}

interface BoxProps {
  listInputVal: string;
  list: ListType;
  inputVal: string;
  editId: number | null;
  setEditId: (id: number | null) => void;
  handleListDelete: (id: number) => void;
  setDraggedEl: (dragged: { card: CardType; listId: number } | null) => void;
  onDragStopped: (listId: number) => void;
  handleAddCard: (listId: number, text: string) => void;
  setCard: (cards: CardType[], listId: number) => void;
}

const Box: FC<BoxProps> = ({
  listInputVal,
  list,
  inputVal,
  editId,
  setEditId,
  handleListDelete,
  setDraggedEl,
  onDragStopped,
  handleAddCard,
  setCard,
}) => {
  const handleInputVal = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const newCardList = list.cards.map((c) =>
      c.id === id ? { ...c, text: e.target.value } : c
    );
    setCard(newCardList, list.id);
  };

  const handleCardDelete = (cardId: number) => {
    const newCardList = list.cards.filter((c) => c.id !== cardId);
    setCard(newCardList, list.id);
  };

  const handleEditIdChange = (cardId: number) => {
    setEditId(cardId);
  };

  const handleSaveIdChange = () => {
    setEditId(null);
  };

  return (
    <div
      className="box"
      onDrop={(e) => {
        e.preventDefault();
        onDragStopped(list.id);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="header">
        {listInputVal}
        <ClearIcon
          onClick={() => handleListDelete(list.id)}
          sx={{
            cursor: "pointer",
            borderRadius: "50%",
            padding: "5px",
            "&:hover": {
              backgroundColor: "grey",
            },
          }}
        />
      </div>
      {list.cards.map((card) => {
        const editMode = editId === card.id;
        return (
          <div
            key={card.id}
            draggable
            onDragStart={() => {
              setDraggedEl({ card: card, listId: list.id });
            }}
            className="card-cont"
            role="listitem"
            aria-grabbed="true"
          >
            <Card
              handleCardDelete={handleCardDelete}
              handleEditIdChange={handleEditIdChange}
              handleSaveIdChange={handleSaveIdChange}
              editMode={editMode}
              handleInputVal={handleInputVal}
              id={card.id}
              inputVal={card.text}
            />
          </div>
        );
      })}
      <div onClick={() => handleAddCard(list.id, inputVal)} className="footer">
        Add a card...
      </div>
    </div>
  );
};

export default Box;

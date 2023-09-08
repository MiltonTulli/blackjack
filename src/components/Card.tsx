"use client";
import { Card as ICard } from "@/types";
import { BlackJackUtils } from "@/lib/BlackJackUtils";

const getColor = (symbol: string, hidden: boolean) => {
  if (hidden) return "black";
  if (["Spades", "Clubs"].includes(symbol)) return "black";
  if (["Hearts", "Diamonds"].includes(symbol)) return "red";
};

interface CardProps {
  card: ICard;
  hidden: boolean;
  index: number;
}

export const Card = ({ card, hidden = false, index }: CardProps) => {
  const symbol = BlackJackUtils.getSymbol(card.symbol);
  const color = getColor(card.symbol, hidden);

  const style = {
    transform: `translate(-${index * 70}px, 0px) rotate(-2deg)`,
    opacity: hidden ? 0.5 : 1,
    color: color,
    minWidth: "8rem",
    minHeight: "12rem",
  };

  const baseTextClass = `text font-bold`;
  return (
    <div
      style={style}
      className="w-32 h-48 shadow-2xl shadow-slate-900 bg-white rounded-lg flex flex-col justify-between"
    >
      <div className="flex justify-between p-2">
        <span className={`${baseTextClass} text-2xl`}>
          {hidden ? "?" : symbol}
        </span>
        <span className={`${baseTextClass} text-2xl`}>
          {hidden ? "?" : card.value}
        </span>
      </div>
      <div className="p-2">
        <span className={`text-5xl font-bold`}>
          {hidden ? "?" : card.value}
        </span>
      </div>
      <div className="flex justify-between p-2">
        <span className={`${baseTextClass} text-2xl`}>
          {hidden ? "?" : symbol}
        </span>
        <span className={`${baseTextClass} text-2xl`}>
          {hidden ? "?" : card.value}
        </span>
      </div>
    </div>
  );
};
